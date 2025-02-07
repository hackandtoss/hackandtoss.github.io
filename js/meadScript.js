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

      // Update the last row's time input
      const elapsedSinceLastLap = Date.now() - this.currentLapStart;
      if (elapsedSinceLastLap > 500) {
        const lastRow = $(".data-row").last();
        lastRow.find(".time-input").val(this.formatTime(elapsedSinceLastLap));
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

    // Update the current row's time input
    const currentRow = $(".data-row").last();
    currentRow.find(".time-input").val(this.formatTime(lapTime));

    // Add a new row for the next lap
    const newRowNumber = lapNumber + 1;
    const dataRow = `<tr class="data-row">
        <td class="lap-count">${newRowNumber}</td>
        <td class="time-between">
            <input type="text" class="form-control time-input">
        </td>
        <td class="bubbles"><input type="number" class="form-control bubbles" required></td>
        <td class="strength">
            <select class="form-select strength">
                <option value="" disabled selected>Select</option>
                <option value="weak">Weak</option>
                <option value="medium">Medium</option>
                <option value="normal">Normal</option>
                <option value="strong">Strong</option>
            </select>
        </td>
    </tr>`;
    const notesRow = `<tr class="notes-row">
        <td colspan="4"><textarea class="form-control notes" placeholder="Notes"></textarea></td>
    </tr>`;
    $("#dataTable tbody").append(dataRow + notesRow);

    // Update bubble interval display
    $("#bubble-interval").text(
      `Last Bubble Interval: ${this.formatTime(lapTime)}`
    );

    // Update average lap time
    const totalLapTime = this.laps.reduce((a, b) => a + b, 0);
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
    const rowNumber = $(".data-row").length + 1;
    const dataRow = `<tr class="data-row">
        <td class="lap-count">${rowNumber}</td>
        <td class="time-between">
            <input type="text" class="form-control time-input">
        </td>
        <td class="bubbles"><input type="number" class="form-control bubbles" required></td>
        <td class="strength">
            <select class="form-select strength">
                <option value="" disabled selected>Select</option>
                <option value="weak">Weak</option>
                <option value="medium">Medium</option>
                <option value="normal">Normal</option>
                <option value="strong">Strong</option>
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
    const doc = new jsPDF("p", "mm", "letter"); // Letter paper size (approx. 216 x 279 mm)
  
    // Styling constants
    const headerColor = [44, 62, 80]; // Dark blue for headers
    const textColor = [34, 34, 34];    // Dark gray for text
    const margin = 15;                // Page margin
    let yPosition = margin;           // Starting vertical position
  
    // Helper function to convert 24-hour time (HH:MM) to 12-hour format with AM/PM
    function convertTo12Hour(time24) {
      const [hourStr, minute] = time24.split(":");
      let hour = parseInt(hourStr, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12;
      return `${hour}:${minute} ${ampm}`;
    }
  
    // Helper function: parse a manual time string (expected format: mm:ss.ms) into milliseconds
    function parseTimeString(timeStr) {
      // Example expected format: "03:14.159"
      const parts = timeStr.split(":");
      if (parts.length < 2) return 0;
      const minutes = parseInt(parts[0], 10);
      const secParts = parts[1].split(".");
      if (secParts.length < 2) return 0;
      const seconds = parseInt(secParts[0], 10);
      const ms = parseInt(secParts[1], 10);
      return minutes * 60000 + seconds * 1000 + ms;
    }
  
    // Helper function: format milliseconds as mm:ss.ms
    function formatTimeManual(milliseconds) {
      const minutes = Math.floor(milliseconds / 60000);
      const seconds = Math.floor((milliseconds % 60000) / 1000);
      const ms = milliseconds % 1000;
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
    }
  
    // 1. Add Report Header
    doc.setFontSize(18);
    doc.setTextColor(...headerColor);
    doc.text("Mead Fermentation Report", margin, yPosition);
    yPosition += 10;
  
    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    const reportGenerated = new Date().toLocaleString();
    doc.text(`Report Generated: ${reportGenerated}`, margin, yPosition);
    yPosition += 10;
  
    // 2. Add Session Details as Plain Text
    const hoursValue = $("#hours").val() || "N/A";
    const startTime24 = $("#time").val() || "N/A";
    const startTime12 = startTime24 !== "N/A" ? convertTo12Hour(startTime24) : "N/A";
    const temperature = $("#temperature").val() || "N/A";
    const humidity = $("#humidity").val() || "N/A";
    const sessionDetailsText = `Session Details: Hours - ${hoursValue}, Start Time - ${startTime12}, Temperature (°F) - ${temperature}, Humidity (%) - ${humidity}`;
    doc.setFontSize(12);
    doc.setTextColor(...headerColor);
    doc.text(sessionDetailsText, margin, yPosition);
    yPosition += 10;
  
    // 3. Add Summary Section (prioritize stopwatch values, fallback to manual if stopwatch is default)
    doc.setFontSize(14);
    doc.setTextColor(...headerColor);
    doc.text("Summary", margin, yPosition);
    yPosition += 8;
  
    const totalBubbles = $(".data-row .bubbles input")
      .get()
      .reduce((sum, el) => sum + (+el.value || 0), 0);
  
    const stopwatchDuration = $("#stopwatch").text(); // e.g., "00:00.000"
    let totalDurationStr, averageIntervalStr;
    if (stopwatchDuration !== "00:00.000") {
      // Use stopwatch values if available
      totalDurationStr = stopwatchDuration;
      averageIntervalStr = $("#average-time").text().replace("Average Lap: ", "");
    } else {
      // Otherwise, sum the manual times from .time-input fields
      let manualTotal = 0;
      let manualCount = 0;
      $(".data-row").each(function () {
        const timeStr = $(this).find(".time-input").val();
        if (timeStr && timeStr.trim() !== "") {
          const t = parseTimeString(timeStr);
          if (!isNaN(t)) {
            manualTotal += t;
            manualCount++;
          }
        }
      });
      if (manualCount > 0) {
        totalDurationStr = formatTimeManual(manualTotal);
        averageIntervalStr = formatTimeManual(Math.round(manualTotal / manualCount));
      } else {
        // Fallback in case neither is entered
        totalDurationStr = stopwatchDuration;
        averageIntervalStr = $("#average-time").text().replace("Average Lap: ", "");
      }
    }
  
    const summaryData = {
      "Total Duration": totalDurationStr,
      "Total Bubbles": totalBubbles,
      "Average Interval": averageIntervalStr,
    };
  
    doc.autoTable({
      startY: yPosition,
      head: [["Metric", "Value"]],
      body: Object.entries(summaryData),
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 3, textColor: textColor },
      headStyles: { fillColor: headerColor, textColor: [255, 255, 255] },
      margin: { left: margin, right: margin },
    });
    yPosition = doc.lastAutoTable.finalY + 10;
  
    // 4. Add Detailed Measurements Section
    doc.setFontSize(14);
    doc.setTextColor(...headerColor);
    doc.text("Detailed Measurements", margin, yPosition);
    yPosition += 8;
  
    const tableData = [];
    $(".data-row").each(function () {
      const lap = $(this).find(".lap-count").text();
      const timeInterval = $(this).find(".time-input").val() || "--";
      const bubbles = $(this).find(".bubbles input").val() || "0";
      const strength = $(this).find(".strength select").val() || "N/A";
      const notes = $(this).next(".notes-row").find(".notes").val() || "No notes";
      tableData.push([lap, timeInterval, bubbles, strength, notes]);
    });
  
    doc.autoTable({
      startY: yPosition,
      head: [["Lap", "Time Interval", "Bubbles", "Strength", "Notes"]],
      body: tableData,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 2, textColor: textColor },
      headStyles: { fillColor: headerColor, textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [241, 243, 245] },
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 95 },
      },
    });
  
    // 5. Add footer on each page
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(
        `Page ${i} of ${pageCount} - Mead Tracker`,
        doc.internal.pageSize.width - 60,
        doc.internal.pageSize.height - 10
      );
    }
  
    // Save the PDF
    doc.save("Mead_Fermentation_Report.pdf");
  });

});
