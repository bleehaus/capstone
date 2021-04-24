function setup() {
  noCanvas();
  // createCanvas(windowWidth, windowHeight);
  let speech = new p5.Speech();
  let lang = navigator.language || "en-US";
  let speechRec = new p5.SpeechRec(lang, gotSpeech);
  speech.setVoice("Google US English");

  let name = select("#name");
  let body = select("body");
  let button = select("#submit");
  let startspeak = select("#startRec");
  let micstatus = select("#micStatus");
  let user_input = select("#user_input");
  let output = select("#output");
  let chatspace = select(".chatspace");
  let replyspace = select("#replyspace");
  let botreply = select(".botreply");
  let userreply = select(".userreply");
  let scorebox = select("#scoreBox");
  let volumebox = select("#volumeBox");
  let volumeslider = select("#volumeSlider");
  let volumeLevel = select("#volumeLevel");
  let intro = select(".intro");
  let rightScore = select("#rightScore");
  let wrongScore = select("#wrongScore");
  let totalScore = select("#totalScore");
  let progressBar = select('#progressBar');
  let progress = select('#progress');
  let progressStatus = select('#progressStatus');
  
  progressBar.style("background-color", "rgba(" + 255 + ", " + 255 + ", " + 255 + ", " + 0.9 + ")");

  volumeControl = createSlider(0, 1, 0.5, 0.1).parent(volumeslider);
  speech.setVolume(volumeControl.value());
  console.log("volume: " + volumeControl.value());
  // createSlider(min, max, [value], [step])
  // volumeControl.style("positon", "fixed")
  // volumeControl.position(10, 10);
  volumeControl.addClass("volumeSlider");
  volumeControl.style("width", "80px", "z-index", "10");
  // volumeControl.style();
  volumeControl.input(changeVolume);

  function changeVolume() {
    volumeControl.input(updateText);
    speech.setVolume(volumeControl.value());
    console.log("volume: " + volumeControl.value());
  }

  function updateText() {
    volumeLevel.html("buddy volume: <b><br>" + volumeControl.value() * 100 + "%");
    speech.setVolume(volumeControl.value());
    console.log("volume: " + volumeControl.value());
  }
                                                        
  function autoScroll(selectedId) {
     var div = document.getElementById(selectedId);
     $('#' + selectedId).animate({
        scrollTop: selectedId.scrollHeight - selectedId.clientHeight
     }, 500);
    console.log('resetting text from script.js');
    // document.getElementById("user_input").value = "type a message to the bot";
    document.getElementById("user_input").value = "";
  }
  
  function autoScrollReplySpace() {
    var div = document.getElementById(replyspace);
    // div.scrollTop = div.scrollHeight - div.clientHeight;
    replyspace.scrollTop = replyspace.scrollHeight - replyspace.clientHeight;
     // $("#replyspace").animate({
     //    scrollTop: div.scrollHeight - div.clientHeight
     // }, 500);
  }
  
  document.getElementById("user_input").addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("submit").click();
      // chat();
      
    }
  });
  
  document.getElementById ("submit").addEventListener ("click", chat);
  
  startspeak.mousePressed(startRec);
  function startRec() {
    var getConfirm = confirm('Would you like to enable your mic to speak to the practice buddy? \nIf you click "Cancel," nothing will happen. \nIf you click "OK," your browser will ask for mic access. If you accept, keep in mind that your mic will be enabled and listening until you refresh the page.');
    if (getConfirm == true) {
      let listenContinuous = false;
      let listenInterim = true;
      speechRec.start(listenInterim, listenContinuous);
      startspeak.html('<span class="material-icons">mic</span>');
      micstatus.html("mic enabled: listening");
    }
  }
  
  let bot = new RiveScript();
  bot.loadFile("brain.rive", brainReady, brainError);

  function brainReady() {
    console.log("Chatbot ready!");
    bot.sortReplies();
  }

  function brainError() {
    console.log("Chatbot error!");
  }

  speech.speak(
    "hi! i'm a gender pronouns practice buddy! who would you like to talk about today?"
  );

  let scoreWrong = 0;
  let scoreRight = 0;
  let scoreTotal = scoreRight - scoreWrong;

  // function autoScroll(id) {
  //   console.log("auto scroll");
  //   var div = document.getElementById(id);
  //   $(id).animate(
  //     {
  //       scrollTop: div.scrollHeight - div.clientHeight
  //     },
  //     500
  //   );
  //   user_input.value = "type a message to the bot";
  //   console.log("resetting text");
  // }


  let red = 0;
  let blue = 0;
  let green = 0;
  
  let rightEmojiArray = [
            "💝",
            "🖤",
            "💕",
            "💖",
            "🧡",
            "💛",
            "💙",
            "💜",
            "💎",
            "💞",
            "💘",
            "💗",
            "💚",
            "❤️",
            "⭐",
            "🎊",
            "🎉",
            "🎀",
            "💫",
            "🌟",
            "🌙",
            "🌕",
            "🌸",
            "🍃",
            "🌷",
            "🌻",
            "💐",
            "🍀",
            "🌈"
          ];

  function gotSpeech() {
    if (speechRec.resultValue) {
      let input = speechRec.resultString;
      console.log("bot hears: ", input);
      bot.reply("local-user", input).then(function(reply) {
        botReplyText.addClass("botreply");
        console.log("bot says: ", reply);
        speech.speak(reply);
        let botReplyLabel = createP("<br><br><b>practice buddy</b><br>").parent(
          replyspace
        );
        botReplyLabel.addClass("botreplylabel");
        let botReplyText = createP(reply).parent(replyspace);
        botReplyText.addClass("botreplytext");
        document.getElementById("replyspace").scrollTop = document.getElementById("replyspace").scrollHeight - document.getElementById("replyspace").clientHeight;
        let userReplyLabel = createP("<b>me</b><br> ").parent(replyspace);
        userReplyLabel.addClass("userreplylabel");
        let userReplyText = createP(speechRec.resultString).parent(replyspace);
        userReplyText.addClass("userreply");
        document.getElementById("replyspace").scrollTop = document.getElementById("replyspace").scrollHeight - document.getElementById("replyspace").clientHeight;
        //REACTIONS
        if (reply.includes("keep it up") || reply.includes("get your total score to")) {
          var myCanvas = document.getElementById("confettiCanvas");
          var myConfetti = confetti.create(myCanvas, {
            resize: true,
            useWorker: true
          });
          myConfetti({
            particleCount: 100,
            spread: 100,
            angle: 90,
            startVelocity:50
          });
          scoreRight++;
          scoreTotal++;
          console.log("RIGHT! total score is: " + scoreTotal);
          rightScore.html("<b>" + scoreRight + "</b>");
          totalScore.html("<b>" + scoreTotal + "</b>" + ' of 5');
          let emoji = random(rightEmojiArray);
          let emojiSpan = createSpan(emoji).parent(chatspace);
          emojiSpan.addClass("drag");
          emojiSpan.position(random(0, window.innerWidth-150), random(0, window.innerHeight-150));
          emojiSpan.style("font-size", random(50, 100) + "px", "transform", "rotate(" + random(100, 720) + "deg)");
          green = 200;
          red = 0;
          progressBar.style(
            "width", scoreTotal*20 + "%", "background-color", "rgba(" + red + "," + green + ", " + blue + ", " + 0.9 + ")"
          );
          progress.style(
            "background-color", "rgba(" + 255 + "," + 255 + ", " + 255 + ", " + 0.5 + ")"
          );
          progressStatus.html("progress: <b>" + scoreTotal*20 + "%");
          if (scoreTotal > 0) {
            progressBar.style(
              "background-color", "rgba(" + 0 + "," + 200 + ", " + blue + ", " + 0.9 + ")"
            );
          }
          else if (scoreTotal == 5) {
            progressBar.style(
              "background-color", "rgba(" + 0 + "," + 200 + ", " + blue + ", " + 0.9 + ")"
            );
          }
          else {
            progress.style(
              "background-color", "rgba(" + 200 + "," + 0 + ", " + blue + ", " + 0.5 + ")"
            );
          }
          if (scoreTotal > 5) {
            progressBar.style(
              "width", scoreTotal*10 + "%"
            );
            totalScore.html('<b>' + scoreTotal + '</b> of 10');
            progressStatus.html("progress: <b>" + scoreTotal*10 + "%");
          }
        }
        if (reply.includes("congratulations")) {
          var myCanvas = document.getElementById("confettiCanvas");
            var myConfetti = confetti.create(myCanvas, {
              resize: true,
              useWorker: true
            });
            myConfetti({
              particleCount: 2000,
              spread: 1000,
              angle: 90,
              startVelocity:60
            });
        }
        if (reply.includes("remember")) {
          scoreWrong++;
          scoreTotal--;
          console.log("WRONG! total score is: " + scoreTotal);
          wrongScore.html("<b>" + scoreWrong + "</b>");
          totalScore.html("<b>" + scoreTotal + "</b>" + ' of 5');
          let random100 = random(10, 80);
          let emoji = "💔";
          red = 200;
          green = 0;
          progressBar.style(
            "width", scoreTotal*20 + "%"
          );
          progressBar.style(
            "background-color", "rgba(" + 200 + "," + 0 + ", " + blue + ", " + 0.9 + ")"
          );
          progress.style(
            "background-color", "rgba(" + 255 + "," + 255 + ", " + 255 + ", " + 0.5 + ")"
          );
          if (scoreTotal == 5) {
            progressBar.style(
              "background-color", "rgba(" + 0 + "," + 200 + ", " + blue + ", " + 0.9 + ")"
            );
            progress.style(
              "background-color", "rgba(" + 255 + "," + 255 + ", " + 255 + ", " + 0.5 + ")"
            );
          }
          else if (scoreTotal < 0||scoreTotal == 0) {
            progress.style(
              "background-color", "rgba(" + 200 + "," + 0 + ", " + blue + ", " + 0.5 + ")"
            );
          }
          if (scoreTotal > 5) {
            progressBar.style(
              "width", scoreTotal*10 + "%"
            );
            totalScore.html("<b>" + scoreTotal + "</b> of 10");
            progressStatus.html("progress: <b>" + scoreTotal*10 + "%");
          }
          progressStatus.html("progress: <b>" + scoreTotal*20 + "%");
        }
        if (reply.includes("tell me more about")) {
          progressBar.style(
            "width", 50 + "%"
          );
          totalScore.html(scoreTotal + ' of 10');
          progressStatus.html("progress: <b>" + 50 + "%");
        }
      });
    }
  }
  

  function chat() {
    let input = user_input.value();
    console.log("user types: ", input);
    user_input.value(input);
    let reply = bot.reply("local-user", input);
    // speech.speak(input);
    bot.reply("local-user", input).then(function(reply) {
      console.log("bot says: ", reply);
      speech.speak(reply);
      let botReplyLabel = createP("<b>practice buddy</b><br>").parent(
        replyspace
      );
      botReplyLabel.addClass("botreplylabel");
      let botReplyText = createP(reply).parent(replyspace);
      botReplyText.addClass("botreply");
      document.getElementById("replyspace").scrollTop = document.getElementById("replyspace").scrollHeight - document.getElementById("replyspace").clientHeight;
      if (reply.includes("keep it up") || reply.includes("get your total score to")) {
        var myCanvas = document.getElementById("confettiCanvas");
        var myConfetti = confetti.create(myCanvas, {
          resize: true,
          useWorker: true
        });
        myConfetti({
          particleCount: 100,
          spread: 100,
          angle: 90,
          startVelocity:50
        });
        scoreRight++;
        scoreTotal++;
        console.log("RIGHT! total score is: " + scoreTotal);
        rightScore.html("<b>" + scoreRight + "</b>");
        totalScore.html("<b>" + scoreTotal + "</b>" + ' of 5');
        let emoji = random(rightEmojiArray);
        let emojiSpan = createSpan(emoji).parent(chatspace);
        emojiSpan.addClass("drag");
        emojiSpan.position(random(0, window.innerWidth-150), random(0, window.innerHeight-150));
        emojiSpan.style("font-size", random(50, 100) + "px", "transform", "rotate(" + random(100, 720) + "deg)");
        green = 200;
        red = 0;
        progressBar.style(
          "width", scoreTotal*20 + "%", "background-color", "rgba(" + red + "," + green + ", " + blue + ", " + 0.9 + ")"
        );
        progress.style(
          "background-color", "rgba(" + 255 + "," + 255 + ", " + 255 + ", " + 0.5 + ")"
        );
        progressStatus.html("progress: <b>" + scoreTotal*20 + "%");
        if (scoreTotal > 0) {
          progressBar.style(
            "background-color", "rgba(" + 0 + "," + 200 + ", " + blue + ", " + 0.9 + ")"
          );
        }
        else if (scoreTotal == 5) {
          progressBar.style(
            "background-color", "rgba(" + 0 + "," + 200 + ", " + blue + ", " + 0.9 + ")"
          );
        }
        else {
          progress.style(
            "background-color", "rgba(" + 200 + "," + 0 + ", " + blue + ", " + 0.5 + ")"
          );
        }
        if (scoreTotal > 5) {
          progressBar.style(
            "width", scoreTotal*10 + "%"
          );
          totalScore.html('<b>' + scoreTotal + '</b> of 10');
          progressStatus.html("progress: <b>" + scoreTotal*10 + "%");
        }
      }
      if (reply.includes("congratulations")) {
        var myCanvas = document.getElementById("confettiCanvas");
          var myConfetti = confetti.create(myCanvas, {
            resize: true,
            useWorker: true
          });
          myConfetti({
            particleCount: 2000,
            spread: 1000,
            angle: 90,
            startVelocity:60
          });
      }
      if (reply.includes("remember")) {
        scoreWrong++;
        scoreTotal--;
        console.log("WRONG! total score is: " + scoreTotal);
        wrongScore.html("<b>" + scoreWrong + "</b>");
        totalScore.html("<b>" + scoreTotal + "</b>" + ' of 5');
        let random100 = random(10, 80);
        let emoji = "💔";
        red = 200;
        green = 0;
        progressBar.style(
          "width", scoreTotal*20 + "%"
        );
        progressBar.style(
          "background-color", "rgba(" + 200 + "," + 0 + ", " + blue + ", " + 0.9 + ")"
        );
        progress.style(
          "background-color", "rgba(" + 255 + "," + 255 + ", " + 255 + ", " + 0.5 + ")"
        );
        if (scoreTotal == 5) {
          progressBar.style(
            "background-color", "rgba(" + 0 + "," + 200 + ", " + blue + ", " + 0.9 + ")"
          );
          progress.style(
            "background-color", "rgba(" + 255 + "," + 255 + ", " + 255 + ", " + 0.5 + ")"
          );
        }
        else if (scoreTotal < 0||scoreTotal == 0) {
          progress.style(
            "background-color", "rgba(" + 200 + "," + 0 + ", " + blue + ", " + 0.5 + ")"
          );
        }
        if (scoreTotal > 5) {
          progressBar.style(
            "width", scoreTotal*10 + "%"
          );
          totalScore.html("<b>" + scoreTotal + "</b> of 10");
          progressStatus.html("progress: <b>" + scoreTotal*10 + "%");
        }
        progressStatus.html("progress: <b>" + scoreTotal*20 + "%");
      }
      if (reply.includes("tell me more about")) {
        progressBar.style(
          "width", 50 + "%"
        );
        totalScore.html(scoreTotal + ' of 10');
        progressStatus.html("progress: <b>" + 50 + "%");
      }
    });
    let userReplyLabel = createP("<b>me</b><br>").parent(replyspace);
    // userReplyLabel.style('font-size', '0.75em', 'margin', '0', 'padding', '0', 'text-align', 'right', 'float', 'right');
    userReplyLabel.addClass("userreplylabel");
    let userReplyText = createP(input).parent(replyspace);
    // userReplyText.style('font-size', '1em', 'margin', '0', 'padding', '0', 'border-radius', '200px 200px 0px 200px', 'background-color', 'rgba(255, 255, 255, 0.8)');
    userReplyText.addClass("userreply");
    document.getElementById("user_input").value = "";
    // autoScrollReplySpace();
    // autoScroll(replyspace);
    document.getElementById("replyspace").scrollTop = document.getElementById("replyspace").scrollHeight - document.getElementById("replyspace").clientHeight;
  }

  //   dragElement(document.getElementById("span"));
  //     dragElement(document.getElementById("micBox"));
  //     // dragElement(document.getElementById("volumeBoxDrag"));
  //     // dragElement(document.getElementById("volumeBox"));
  //     // dragElement(document.getElementById("volumeBox"));

  // button.mousePressed(chat);
  // button.onclick = chat();

  // document.getElementById("submit").addEventListener("click", chat);

  // document.getElementById("submit").addEventListener("click", autoScroll("replyspace"));


  
  // document.getElementById("user_input").addEventListener("keypress", function(enter) {
  //     if (enter.key === "Enter") {
  //       button.mousePressed(chat);
  //       // button.onclick = chat();
  //       // autoScroll(replyspace);
  //       chat();
  //       autoScroll(replyspace);
  //       console.log("autoscroll chat, enter was prssed in chat");
  //       // user_input.value = "type a message to the bot";
  //       console.log("resetting text from script.js");
  //       // document.getElementById("user_input").value = "type a message to the bot";
  //       document.getElementById("user_input").value = "";
  //       console.log("resetting text");
  //       console.log("enter eventlistener!");
  //     }
  //   });

  //   function dragElement(span) {
  //     var pos1 = 0,
  //       pos2 = 0,
  //       pos3 = 0,
  //       pos4 = 0;
  //     span.onmousedown = dragMouseDown;

  //     function dragMouseDown(e) {
  //       e = e || window.event;
  //       e.preventDefault();
  //       // get the mouse cursor position at startup:
  //       pos3 = e.clientX;
  //       pos4 = e.clientY;
  //       document.onmouseup = closeDragElement;
  //       // call a function whenever the cursor moves:
  //       document.onmousemove = elementDrag;
  //     }

  //     function elementDrag(e) {
  //       e = e || window.event;
  //       e.preventDefault();
  //       // calculate the new cursor position:
  //       pos1 = pos3 - e.clientX;
  //       pos2 = pos4 - e.clientY;
  //       pos3 = e.clientX;
  //       pos4 = e.clientY;
  //       // set the element's new position:
  //       span.style.top = span.offsetTop - pos2 + "px";
  //       span.style.left = span.offsetLeft - pos1 + "px";
  //     }

  //     function closeDragElement() {
  //       /* stop moving when mouse button is released:*/
  //       document.onmouseup = null;
  //       document.onmousemove = null;
  //     }
  //   }

  // var input = document.getElementById("user_input");
  // input.addEventListener("keyup", function(event) {
  //   // Number 13 is the "Enter" key on the keyboard
  //   if (event.keyCode === 13) {
  //     // Cancel the default action, if needed
  //     event.preventDefault();
  //     // Trigger the button element with a click
  //     console.log('enter was pressed');
  //     document.getElementById("submit").click();
  //     // button.click();
  //   }
  // });

  // document.body.addEventListener(function(e) {
  //   if (e.target.nodeName.toUpperCase() === 'A' && e.target.href) {
  //     e.target.target = '_blank';
  //   }
  // }, true);

  // var links = document.links;
  // for (var i = 0; i < links.length; i++) {
  //      links[i].target = "_blank";
  // }

  function startDrag(evt) {
    console.log("something is being dragged");
    var diffX = evt.clientX - this.offsetLeft,
      diffY = evt.clientY - this.offsetTop,
      that = this;
    function moveAlong(evt) {
      that.style.left = evt.clientX - diffX + "px";
      that.style.top = evt.clientY - diffY + "px";
    }
    function stopDrag() {
      document.removeEventListener("mousemove", moveAlong);
      document.removeEventListener("mouseup", stopDrag);
    }
    document.addEventListener("mouseup", stopDrag);
    document.addEventListener("mousemove", moveAlong);
  }
  function startDragIfDraggable(evt) {
    // console.log("dragging now");
    // class named "drag" (http://stackoverflow.com/questions/5898656/):
    if (evt.target.classList.contains("drag")) {
      startDrag.call(evt.target, evt);
    }
  }
  document.body.addEventListener("mousedown", startDragIfDraggable);

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

  var accordionInfo = document.getElementsByClassName("accordionInfo");
  var i;
  for (i = 0; i < accordionInfo.length; i++) {
    console.log("accordion!");
    accordionInfo[i].addEventListener("click", function() {
      console.log("accordion opening");
      this.classList.toggle("infoActive");
      var accordionInfoPanel = this.nextElementSibling;
      if (accordionInfoPanel.style.maxHeight) {
        accordionInfoPanel.style.maxHeight = null;
      } else {
        accordionInfoPanel.style.maxHeight = accordionInfoPanel.scrollHeight + "px";
      }
    });
  }
}
