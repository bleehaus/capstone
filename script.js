var accordion = document.getElementsByClassName("accordion");
  var i;
  for (i = 0; i < accordion.length; i++) {
    console.log("accordion!");
    accordion[i].addEventListener("click", function() {
      console.log("accordion opening");
      this.classList.toggle("active");
      var accordionPanel = this.nextElementSibling;
      if (accordionPanel.style.maxHeight) {
        accordionPanel.style.maxHeight = null;
      } else {
        accordionPanel.style.maxHeight = accordionPanel.scrollHeight + "px";
      }
    });
  }