"use strict";

(() => {
  const ink = "#282828";
  const graphite = "#717171";
  const wash = "#dfdfdf";
  const paper = "#f8f8f8";

  window.createPlanArtwork = function (index) {
    const canvas = document.createElement("canvas");
    canvas.className = "plan-art";
    canvas.width = 600;
    canvas.height = 392;
    canvas.setAttribute("aria-hidden", "true");
    const ctx = canvas.getContext("2d");
    if (!ctx) return canvas;
    ctx.scale(2, 2);
    ctx.lineWidth = 1.4;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    function line(points, color = ink) {
      ctx.strokeStyle = color;
      ctx.beginPath();
      points.forEach(([x, y], position) => {
        if (position === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    function box(x, y, width, height, fill = paper) {
      ctx.fillStyle = fill;
      ctx.fillRect(x, y, width, height);
      ctx.strokeStyle = ink;
      ctx.strokeRect(x, y, width, height);
    }

    function circle(x, y, radius, fill = paper) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = ink;
      ctx.stroke();
    }

    function text(label, x, y, size) {
      ctx.font = size + "px Georgia, serif";
      ctx.fillStyle = ink;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, x, y);
    }

    function dashed(x1, y1, x2, y2) {
      ctx.setLineDash([4, 5]);
      line([[x1, y1], [x2, y2]], graphite);
      ctx.setLineDash([]);
    }

    const illustrations = [
      () => {
        line([[52, 44], [52, 150], [248, 150]]);
        dashed(53, 92, 245, 92);
        [45, 61, 73, 96].forEach((height, i) => box(73 + i * 43, 150 - height, 23, height, i === 3 ? wash : paper));
        text("%", 240, 60, 20);
      },
      () => {
        line([[70, 63], [70, 145], [124, 145], [124, 63]]);
        line([[176, 63], [176, 145], [230, 145], [230, 63]]);
        ctx.fillStyle = wash;
        ctx.fillRect(71, 91, 52, 53);
        ctx.fillRect(177, 110, 52, 34);
        line([[71, 91], [123, 91]], graphite);
        line([[177, 110], [229, 110]], graphite);
        line([[124, 130], [176, 130]]);
        circle(150, 130, 9, paper);
        line([[147, 127], [153, 130], [147, 133]], graphite);
      },
      () => {
        line([[55, 130], [247, 130]], graphite);
        line([[150, 41], [150, 154]], graphite);
        const curve = Array.from({ length: 41 }, (_, i) => {
          const x = 65 + i * 4.25;
          return [x, 146 - (x - 150) ** 2 / 78];
        });
        line(curve);
        [115, 185].forEach(x => circle(x, 130, 4.5, wash));
        dashed(73, 109, 232, 72);
      },
      () => {
        circle(150, 98, 61, paper);
        const triangle = [[150, 37], [96, 126], [204, 126], [150, 37]];
        ctx.fillStyle = wash;
        ctx.beginPath();
        triangle.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
        ctx.fill();
        line(triangle);
        dashed(150, 41, 150, 126);
        [[150, 37], [96, 126], [204, 126]].forEach(([x, y]) => circle(x, y, 3.5, paper));
      },
      () => {
        box(58, 72, 51, 51, wash);
        box(124, 72, 51, 51);
        box(190, 72, 51, 51, wash);
        text("+", 83.5, 98, 31);
        text("×", 149.5, 98, 29);
        text("=", 215.5, 98, 30);
        dashed(58, 142, 241, 142);
      },
      () => {
        line([[61, 150], [239, 150]], graphite);
        const steps = [[67, 137], [108, 117], [149, 97], [190, 77], [231, 57]];
        line(steps);
        steps.forEach(([x, y]) => {
          dashed(x, y + 5, x, 149);
          circle(x, y, 6, wash);
        });
        text("aₙ", 235, 42, 17);
      },
      () => {
        const nodes = [[95, 133], [150, 54], [205, 80]];
        ctx.fillStyle = wash;
        ctx.beginPath();
        nodes.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
        ctx.fill();
        for (const x of [68, 95, 122, 150, 177, 205, 232]) {
          for (const y of [54, 80, 106, 133]) {
            ctx.fillStyle = graphite;
            ctx.fillRect(x - 1, y - 1, 2, 2);
          }
        }
        line([...nodes, nodes[0]]);
        nodes.forEach(([x, y]) => circle(x, y, 4, paper));
      },
      () => {
        box(60, 67, 180, 21);
        box(60, 67, 72, 21, wash);
        box(60, 107, 180, 21);
        box(60, 107, 126, 21, wash);
        [132, 186].forEach(x => dashed(x, 52, x, 146));
        text("2", 94, 77, 17);
        text("7", 119, 117, 17);
      },
      () => {
        box(54, 53, 192, 90);
        box(54, 53, 192, 19, wash);
        [66, 77, 88].forEach(x => circle(x, 62.5, 2));
        text("x² − 7x + 12", 146, 100, 23);
        dashed(97, 121, 195, 121);
      },
      () => {
        box(89, 45, 122, 106, wash);
        box(83, 39, 122, 106);
        [64, 92, 120].forEach((y, i) => {
          box(99, y - 7, 14, 14);
          if (i < 2) line([[101, y], [105, y + 4], [112, y - 4]]);
          line([[126, y], [189 - i * 8, y]], graphite);
        });
      },
    ];
    illustrations[index]?.();
    return canvas;
  };
})();
