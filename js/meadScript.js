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

      // Record final lap if there's unrecorded time
      const elapsedSinceLastLap = Date.now() - this.currentLapStart;
      if (elapsedSinceLastLap > 0) {
        this.lap();
      }
    }
  }

  reset() {
    this.stop();
    this.totalMilliseconds = 0;
    this.laps = [];
    this.updateDisplay();
    $("#lap").prop("disabled", true).text(" Lap");
    $("#average-time").text("Average Lap: --");
  }

  lap() {
    const now = Date.now();
    const lapTime = now - this.currentLapStart;
    this.currentLapStart = now;
    this.laps.push(lapTime);

    // Determine the lap number using the laps array length
    const lapNumber = this.laps.length;

    if ($("#defaultRow").length) {
      // Update default row's time and then remove its id so it won't be updated again
      $("#defaultRow .time-between").text(this.formatTime(lapTime));
      $("#defaultRow").find(".lap-count").text(lapNumber);
      $("#defaultNotesRow .notes").val($("#defaultNotesRow .notes").val()); // preserve any notes
      $("#defaultRow").removeAttr("id");
      $("#defaultNotesRow").removeAttr("id");
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
      $("#dataTable tbody").append(dataRow + notesRow);
    }

    // Update bubble interval display
    $("#bubble-interval").text(
      `Last Bubble Interval: ${this.formatTime(lapTime)}`
    );

    // Update average lap time (computed only from recorded laps)
    const totalLapTime = this.laps.reduce((a, b) => a + b, 0);
    // Get average lap time (computed only from recorded laps) rounded to the nearest millisecond
    const avgLapTime = Math.round(totalLapTime / this.laps.length);
    $("#average-time").text(`Average Lap: ${this.formatTime(avgLapTime)}`);
  }

  update() {
    this.totalMilliseconds = Date.now() - this.startTime;
    this.updateDisplay();

    // Update current lap display using new format
    const currentLapTime = Date.now() - this.currentLapStart;
    $("#current-lap").text(`Current Lap: ${this.formatTime(currentLapTime)}`);

    this.updateTextColor();
  }

  updateDisplay() {
    $("#stopwatch").text(this.formatTime(this.totalMilliseconds));
    this.updateTextColor();
  }

  // Format milliseconds into mm:ss:ms format (minutes:seconds.milliseconds)
  formatTime(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const ms = milliseconds % 1000;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}.${String(ms).padStart(3, "0")}`;
  }

  updateTextColor() {
    if ($("body").hasClass("dark-mode")) {
      $("#stopwatch, #current-lap, #bubble-interval, #average-time").css(
        "color",
        "#fff"
      );
    } else {
      $("#stopwatch, #current-lap, #bubble-interval, #average-time").css(
        "color",
        ""
      );
    }
  }
}

$(document).ready(function () {
  const stopwatch = new Stopwatch();

  let now = new Date();

  // Format date as YYYY-MM-DD
  let dateString = now.toISOString().split("T")[0];

  // Format time as HH:MM (24-hour format)
  let hours = String(now.getHours()).padStart(2, "0");
  let minutes = String(now.getMinutes()).padStart(2, "0");
  let timeString = `${hours}:${minutes}`;

  // Set values in the input fields
  $("#date").val(dateString);
  $("#time").val(timeString);

  $("#startStop").click(function () {
    if (!stopwatch.running) {
      stopwatch.start();
      $(this).html('<i class="fas fa-pause"></i> Pause');
      $("#lap").prop("disabled", false);
    } else {
      stopwatch.stop();
      $(this).html('<i class="fas fa-play"></i> Start');
    }
  });

  $("#stop").click(function () {
    stopwatch.stop();
    $("#startStop").html('<i class="fas fa-play"></i> Start');
    $("#lap").prop("disabled", true);
  });

  $("#lap").click(() => stopwatch.lap());

  $("#addRow").click(function () {
    // Append a new record (2 rows: data row and notes row)
    const rowNumber = $(".data-row").length + 1;
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
    $("#dataTable tbody").append(dataRow + notesRow);
  });

  $("#downloadPDF").click(function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "a4");

    // Styling constants
    const headerColor = [44, 62, 80]; // Dark blue for headers
    const rowColor = [241, 243, 245]; // Light gray for alternate rows
    const textColor = [34, 34, 34]; // Dark gray for text
    const margin = 15; // Page margin
    let yPosition = margin; // Tracks vertical position on the page

    // Add header
    doc.setFontSize(18);
    doc.setTextColor(...headerColor);
    doc.text("Mead Fermentation Report", margin, yPosition);
    yPosition += 10;

    // Add report generation date and time
    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    doc.text(
      `Report generated: ${new Date().toLocaleString()}`,
      margin,
      yPosition
    );
    yPosition += 15;

    // Add Fermentation Details section
    doc.setFontSize(14);
    doc.setTextColor(...headerColor);
    doc.text("Fermentation Details", margin, yPosition);
    yPosition += 10;

    // Extract Fermentation Details
    const fermentationDetails = {
      Date: $("#date").val(),
      Time: $("#time").val(),
      Hours: $("#hours").val(),
      "Temperature (°F)": $("#temperature").val(),
      "Humidity (%)": $("#humidity").val(),
    };

    // Create Fermentation Details table
    doc.autoTable({
      startY: yPosition,
      head: [["Metric", "Value"]],
      body: Object.entries(fermentationDetails),
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 3,
        textColor: textColor,
      },
      headStyles: {
        fillColor: headerColor,
        textColor: [255, 255, 255],
      },
    });
    yPosition = doc.lastAutoTable.finalY + 10;

    // Add Summary Section
    doc.setFontSize(14);
    doc.setTextColor(...headerColor);
    doc.text("Fermentation Summary", margin, yPosition);
    yPosition += 10;

    // Summary data
    const summaryData = {
      "Total Duration": $("#stopwatch").text(),
      "Total Bubbles": $(".bubbles")
        .get()
        .reduce((sum, el) => sum + (+el.value || 0), 0),
      "Average Interval": $("#average-time")
        .text()
        .replace("Average Lap: ", ""),
      "Last Interval": $("#bubble-interval")
        .text()
        .replace("Last Bubble Interval: ", ""),
    };

    // Create Summary table
    doc.autoTable({
      startY: yPosition,
      head: [["Metric", "Value"]],
      body: Object.entries(summaryData),
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 3,
        textColor: textColor,
      },
      headStyles: {
        fillColor: headerColor,
        textColor: [255, 255, 255],
      },
    });
    yPosition = doc.lastAutoTable.finalY + 10;

    // Add Detailed Measurements Section
    doc.setFontSize(14);
    doc.setTextColor(...headerColor);
    doc.text("Detailed Measurements", margin, yPosition);
    yPosition += 10;

    // Prepare table data
    const tableData = [];
    $(".data-row").each(function (index) {
      const row = {
        lap: $(this).find(".lap-count").text(),
        time: $(this).find(".time-between").text(),
        bubbles: $(this).find(".bubbles input").val(),
        strength: $(this).find(".strength select").val(),
        notes: $(this).next(".notes-row").find(".notes").val(),
      };
      tableData.push([
        row.lap,
        row.time,
        row.bubbles || "0",
        row.strength || "N/A",
        row.notes || "No notes",
      ]);
    });

    // Create Detailed Measurements table
    doc.autoTable({
      startY: yPosition,
      head: [["Lap", "Time Interval", "Bubbles", "Strength", "Notes"]],
      body: tableData,
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 2,
        textColor: textColor,
      },
      headStyles: {
        fillColor: headerColor,
        textColor: [255, 255, 255],
      },
      alternateRowStyles: {
        fillColor: rowColor,
      },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 95 },
      },
    });

    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(
        `Page ${i} of ${pageCount} - hackandtoss Mead Tracker`,
        doc.internal.pageSize.width - 60,
        doc.internal.pageSize.height - 10
      );
    }

    // Save the PDF
    doc.save("Mead_Fermentation_Report.pdf");
  });
});
