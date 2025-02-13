let highestZ = 1;

class Paper {
  holdingPaper = false;
  rotating = false;
  touchStartX = 0;
  touchStartY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  initialAngle = 0;

  init(paper) {
    paper.addEventListener(
      "touchmove",
      (e) => {
        e.preventDefault(); // Prevent scrolling
        const touches = e.touches;

        if (this.holdingPaper && touches.length === 1) {
          // Single touch (dragging)
          let touch = touches[0];
          this.velX = touch.clientX - this.prevTouchX;
          this.velY = touch.clientY - this.prevTouchY;
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
          this.prevTouchX = touch.clientX;
          this.prevTouchY = touch.clientY;

          paper.style.transform = `translate(${this.currentPaperX}px, ${this.currentPaperY}px) rotate(${this.rotation}deg)`;
        } else if (this.rotating && touches.length === 2) {
          // Two fingers (rotation)
          let angle = this.getAngle(touches[0], touches[1]);
          this.rotation = this.initialAngle + angle;
          paper.style.transform = `translate(${this.currentPaperX}px, ${this.currentPaperY}px) rotate(${this.rotation}deg)`;
        }
      },
      { passive: false }
    );

    paper.addEventListener("touchstart", (e) => {
      if (e.touches.length === 2) {
        // Two fingers → Rotate
        this.rotating = true;
        this.initialAngle = this.rotation - this.getAngle(e.touches[0], e.touches[1]);
      } else {
        // One finger → Drag
        this.holdingPaper = true;
        let touch = e.touches[0];

        paper.style.zIndex = highestZ++;
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
        this.prevTouchX = touch.clientX;
        this.prevTouchY = touch.clientY;
      }
    });

    paper.addEventListener("touchend", (e) => {
      if (e.touches.length === 0) {
        this.holdingPaper = false;
        this.rotating = false;
      }
    });
  }

  // Get the angle between two touch points
  getAngle(touch1, touch2) {
    let deltaX = touch2.clientX - touch1.clientX;
    let deltaY = touch2.clientY - touch1.clientY;
    return (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
  }
}

// Initialize all paper elements
const papers = Array.from(document.querySelectorAll(".paper"));
papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});

// Prevent body scrolling
document.body.style.overscrollBehavior = "none";
document.body.style.touchAction = "none";
