class Stopwatch {
  constructor() {
    this.startTime = null;
    this.running = false;
    this.laps = [];
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

      const elapsedSinceLastLap = Date.now() - this.currentLapStart;
      if (elapsedSinceLastLap > 500) {
        const lastRow = $(".data-row").last();
        lastRow.find(".time-input").val(this.formatTime(elapsedSinceLastLap));
      }
    }
  }

  reset() {
    this.stop();
    this.startTime = null;
    this.totalMilliseconds = 0;
    this.currentLapStart = 0;
    this.laps = [];
    this.updateDisplay();
    $("#stopwatch").text("00:00.000");
    $("#current-lap").text("Current Lap: 00:00.000");
    $("#bubble-interval").text("Last Bubble Interval: --");
    $("#lap").prop("disabled", true).text(" Lap");
    $("#average-time").text("Average Lap: --");
  }

  lap() {
    const now = Date.now();
    const lapTime = now - this.currentLapStart;
    this.currentLapStart = now;
    this.laps.push(lapTime);

    const lapNumber = this.laps.length;
    const currentRow = $(".data-row").last();
    currentRow.find(".time-input").val(this.formatTime(lapTime));

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

    $("#bubble-interval").text(
      `Last Bubble Interval: ${this.formatTime(lapTime)}`
    );

    const totalLapTime = this.laps.reduce((a, b) => a + b, 0);
    const avgLapTime = Math.round(totalLapTime / this.laps.length);
    $("#average-time").text(`Average Lap: ${this.formatTime(avgLapTime)}`);
  }

  update() {
    this.totalMilliseconds = Date.now() - this.startTime;
    this.updateDisplay();

    const currentLapTime = Date.now() - this.currentLapStart;
    $("#current-lap").text(`Current Lap: ${this.formatTime(currentLapTime)}`);

    this.updateTextColor();
  }

  updateDisplay() {
    $("#stopwatch").text(this.formatTime(this.totalMilliseconds));
    this.updateTextColor();
  }

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

  const now = new Date();
  const dateString = now.toISOString().split("T")[0];
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const timeString = `${hours}:${minutes}`;

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

  $("#reset").click(function () {
    stopwatch.reset();
    $("#startStop").html('<i class="fas fa-play"></i> Start');
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

  $("#removeRow").click(function () {
    if ($(".data-row").length > 1) {
      $(".notes-row").last().remove();
      $(".data-row").last().remove();
    } else {
      alert("Cannot remove the default row.");
    }
  });

  $("#downloadPDF").click(function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "letter");

    const headerColor = [44, 62, 80];
    const textColor = [34, 34, 34];
    const margin = 15;
    let yPosition = margin;

    function convertTo12Hour(time24) {
      const [hourStr, minute] = time24.split(":");
      let hour = parseInt(hourStr, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12;
      return `${hour}:${minute} ${ampm}`;
    }

    function parseTimeString(timeStr) {
      const parts = timeStr.split(":");
      if (parts.length < 2) return 0;
      const minutesPart = parseInt(parts[0], 10);
      const secondsPart = parts[1].split(".");
      if (secondsPart.length < 2) return 0;
      const seconds = parseInt(secondsPart[0], 10);
      const ms = parseInt(secondsPart[1], 10);
      return minutesPart * 60000 + seconds * 1000 + ms;
    }

    function formatTimeManual(milliseconds) {
      const minutesPart = Math.floor(milliseconds / 60000);
      const seconds = Math.floor((milliseconds % 60000) / 1000);
      const ms = milliseconds % 1000;
      return `${String(minutesPart).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
    }

    doc.setFontSize(18);
    doc.setTextColor(...headerColor);
    doc.text("Mead Fermentation Report", margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    const reportGenerated = new Date().toLocaleString();
    doc.text(`Report Generated: ${reportGenerated}`, margin, yPosition);
    yPosition += 10;

    const hoursValue = $("#hours").val() || "N/A";
    const startTime24 = $("#time").val() || "N/A";
    const startTime12 =
      startTime24 !== "N/A" ? convertTo12Hour(startTime24) : "N/A";
    const temperature = $("#temperature").val() || "N/A";
    const humidity = $("#humidity").val() || "N/A";
    const sessionDetailsText = `Session Details: Hours - ${hoursValue}, Start Time - ${startTime12}, Temperature (deg F) - ${temperature}, Humidity (%) - ${humidity}`;
    doc.setFontSize(12);
    doc.setTextColor(...headerColor);
    doc.text(sessionDetailsText, margin, yPosition);
    yPosition += 10;

    doc.setFontSize(14);
    doc.setTextColor(...headerColor);
    doc.text("Summary", margin, yPosition);
    yPosition += 8;

    const totalBubbles = $(".data-row .bubbles input")
      .get()
      .reduce((sum, el) => sum + (+el.value || 0), 0);

    const stopwatchDuration = $("#stopwatch").text();
    let totalDurationStr;
    let averageIntervalStr;
    if (stopwatchDuration !== "00:00.000") {
      totalDurationStr = stopwatchDuration;
      averageIntervalStr = $("#average-time")
        .text()
        .replace("Average Lap: ", "");
    } else {
      let manualTotal = 0;
      let manualCount = 0;
      $(".data-row").each(function () {
        const timeStr = $(this).find(".time-input").val();
        if (timeStr && timeStr.trim() !== "") {
          const parsedTime = parseTimeString(timeStr);
          if (!isNaN(parsedTime)) {
            manualTotal += parsedTime;
            manualCount++;
          }
        }
      });

      if (manualCount > 0) {
        totalDurationStr = formatTimeManual(manualTotal);
        averageIntervalStr = formatTimeManual(
          Math.round(manualTotal / manualCount)
        );
      } else {
        totalDurationStr = stopwatchDuration;
        averageIntervalStr = $("#average-time")
          .text()
          .replace("Average Lap: ", "");
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
      styles: { fontSize: 10, cellPadding: 3, textColor },
      headStyles: { fillColor: headerColor, textColor: [255, 255, 255] },
      margin: { left: margin, right: margin },
    });
    yPosition = doc.lastAutoTable.finalY + 10;

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
      const notes =
        $(this).next(".notes-row").find(".notes").val() || "No notes";
      tableData.push([lap, timeInterval, bubbles, strength, notes]);
    });

    doc.autoTable({
      startY: yPosition,
      head: [["Lap", "Time Interval", "Bubbles", "Strength", "Notes"]],
      body: tableData,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 2, textColor },
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

    doc.save("Mead_Fermentation_Report.pdf");
  });
});
