class Stopwatch {
  constructor() {
    this.startTime = null;
    this.running = false;
    this.laps = []; // Only lap times recorded after the default row
    this.interval = null;
    this.totalMilliseconds = 0;
    this.currentLapStart = 0;
  }

  start() {
    if (!this.running) {
      this.startTime = Date.now() - this.totalMilliseconds;
      this.currentLapStart = Date.now();
      this.running = true;
      this.interval = setInterval(() => this.update(), 10);
    }
  }

  stop() {
    if (this.running) {
      clearInterval(this.interval);
      this.running = false;
      this.totalMilliseconds = Date.now() - this.startTime;
    }
  }

  reset() {
    this.stop();
    this.totalMilliseconds = 0;
    this.laps = [];
    this.updateDisplay();
    $('#lap').prop('disabled', true).text(' Lap');
    $('#average-time').text('Average Lap: --');
  }

  lap() {
    const now = Date.now();
    const lapTime = now - this.currentLapStart;
    this.currentLapStart = now;
    this.laps.push(lapTime);

    // Determine if the default row (Lap 1) is still in use
    if ($('#defaultRow').length) {
      // Update the default row with the first lap time
      $('#defaultRow').find('.time-between').val(this.formatTime(lapTime));
      // Remove the id so subsequent laps won't update this row
      $('#defaultRow').removeAttr('id');
    } else {
      // Append new row for subsequent laps
      const lapNumber = $('#dataTable tbody tr').length + 1;
      const row = `<tr>
        <td>${lapNumber}</td>
        <td>${this.formatTime(lapTime)}</td>
        <td><input type="number" class="form-control bubbles" required></td>
        <td>
          <select class="form-select strength">
            <option value="" disabled selected>Select</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </td>
        <td><textarea class="form-control notes"></textarea></td>
      </tr>`;
      $('#dataTable tbody').append(row);
    }

    // Update bubble interval display
    $('#bubble-interval').text(`Current Bubble Interval: ${this.formatTime(lapTime)}`);

    // Update average lap time (computed only from recorded laps)
    const totalLapTime = this.laps.reduce((a, b) => a + b, 0);
    const avgLapTime = totalLapTime / this.laps.length;
    $('#average-time').text(`Average Lap: ${this.formatTime(avgLapTime)}`);
  }

  update() {
    this.totalMilliseconds = Date.now() - this.startTime;
    this.updateDisplay();

    // Update current lap display using new format
    const currentLapTime = Date.now() - this.currentLapStart;
    $('#current-lap').text(`Current Lap: ${this.formatTime(currentLapTime)}`);

    // Ensure stopwatch text uses dark mode color if applicable
    this.updateTextColor();
  }

  updateDisplay() {
    $('#stopwatch').text(this.formatTime(this.totalMilliseconds));
    this.updateTextColor();
  }

  // Format milliseconds into mm:ss:ms format (minutes:seconds:milliseconds)
  formatTime(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const ms = milliseconds % 1000;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(ms).padStart(3, '0')}`;
  }

  updateTextColor() {
    if ($('body').hasClass('dark-mode')) {
      $('#stopwatch, #current-lap, #bubble-interval, #average-time').css('color', '#fff');
    } else {
      $('#stopwatch, #current-lap, #bubble-interval, #average-time').css('color', '');
    }
  }
}

$(document).ready(function() {
  const stopwatch = new Stopwatch();

  $('#startStop').click(function() {
    if (!stopwatch.running) {
      stopwatch.start();
      $(this).html('<i class="fas fa-pause"></i> Pause');
      $('#lap').prop('disabled', false);
    } else {
      stopwatch.stop();
      $(this).html('<i class="fas fa-play"></i> Start');
    }
  });

  $('#stop').click(function() {
    stopwatch.stop();
    $('#startStop').html('<i class="fas fa-play"></i> Start');
  });

  $('#lap').click(() => stopwatch.lap());

  $('#addRow').click(function() {
    const row = `<tr>
      <td>${$('#dataTable tbody tr').length + 1}</td>
      <td>--</td>
      <td><input type="number" class="form-control bubbles" required></td>
      <td>
        <select class="form-select strength">
          <option value="" disabled selected>Select</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </td>
      <td><textarea class="form-control notes"></textarea></td>
    </tr>`;
    $('#dataTable tbody').append(row);
  });

  $('#generatePdf').click(function() {
    const doc = new jspdf.jsPDF();
    doc.setFontSize(18);
    doc.text('Mead Fermentation Report', 15, 15);
    doc.setFontSize(12);

    // Add table data
    const rows = [];
    $('#dataTable tbody tr').each(function() {
      const time = $(this).find('td').eq(1).find('input').val() || $(this).find('td').eq(1).text();
      const bubbles = $(this).find('.bubbles').val();
      const strength = $(this).find('.strength').val();
      const notes = $(this).find('.notes').val();
      rows.push([time, bubbles, strength, notes]);
    });

    doc.autoTable({
      startY: 25,
      head: [['Time Between', 'Bubbles', 'Strength', 'Notes']],
      body: rows
    });

    doc.save('fermentation-report.pdf');
  });
});
