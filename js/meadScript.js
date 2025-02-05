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
  
      // Determine the lap number using the laps array length
      const lapNumber = this.laps.length;
  
      if ($('#defaultRow').length) {
        // Update default row's time and then remove its id so it won't be updated again
        $('#defaultRow .time-between').text(this.formatTime(lapTime));
        $('#defaultRow').find('.lap-count').text(lapNumber);
        $('#defaultNotesRow .notes').val($('#defaultNotesRow .notes').val()); // preserve any notes
        $('#defaultRow').removeAttr('id');
        $('#defaultNotesRow').removeAttr('id');
      } else {
        // For subsequent laps, append new rows: one for data and one for notes.
        const dataRow = `<tr class="data-row">
          <td class="lap-count">${lapNumber}</td>
          <td class="time-between">${this.formatTime(lapTime)}</td>
          <td class="bubbles"><input type="number" class="form-control bubbles" required></td>
          <td class="strength">
            <select class="form-select strength">
              <option value="" disabled selected>Select</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </td>
        </tr>`;
        const notesRow = `<tr class="notes-row">
          <td colspan="4"><textarea class="form-control notes" placeholder="Notes"></textarea></td>
        </tr>`;
        $('#dataTable tbody').append(dataRow + notesRow);
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
      // Append a new record (2 rows: data row and notes row)
      const rowNumber = $('.data-row').length + 1;
      const dataRow = `<tr class="data-row">
        <td class="lap-count">${rowNumber}</td>
        <td class="time-between">--</td>
        <td class="bubbles"><input type="number" class="form-control bubbles" required></td>
        <td class="strength">
          <select class="form-select strength">
            <option value="" disabled selected>Select</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </td>
      </tr>`;
      const notesRow = `<tr class="notes-row">
        <td colspan="4"><textarea class="form-control notes" placeholder="Notes"></textarea></td>
      </tr>`;
      $('#dataTable tbody').append(dataRow + notesRow);
    });
  
    $('#generatePdf').click(function() {
      const doc = new jspdf.jsPDF();
      doc.setFontSize(18);
      doc.text('Mead Fermentation Report', 15, 15);
      doc.setFontSize(12);
  
      // Add table data
      const rows = [];
      $('#dataTable tbody tr.data-row').each(function(index) {
        const time = $(this).find('.time-between').text();
        const bubbles = $(this).find('.bubbles').val();
        const strength = $(this).find('.strength').val();
        // Get the corresponding notes from the next row
        const notes = $(this).next('.notes-row').find('.notes').val();
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
  