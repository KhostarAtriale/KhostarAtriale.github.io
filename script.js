document.addEventListener('DOMContentLoaded', function () {
    var startSeqs = {};
var startNum = 0;

// Map employee data to image paths
var imagePaths = employees.map(emp => emp.ImagePath);

$.fn.playSpin = function (options) {
    if (this.length) {
        if ($(this).is(':animated')) return; // Return false if this element is animating
        startSeqs['mainSeq' + (++startNum)] = {};
        $(this).attr('data-playslot', startNum);

        var total = this.length;
        var thisSeq = 0;

        // Initialize options
        if (typeof options == 'undefined') {
            options = {};
        }



        // Pre-define end nums
        var endIndex = Math.floor(Math.random() * imagePaths.length); // Pick a random image index
        var endImages = Array(total).fill(imagePaths[endIndex]); // Fill all slots with the same image

        startSeqs['mainSeq' + startNum]['totalSpinning'] = total;

// Apply flicker effect
var box = document.querySelector('.box');
if (box) {
    box.classList.add('flicker');
    // Remove the flicker class after animation completes
    setTimeout(() => {
        box.classList.remove('flicker');
    }, 15000); // Duration of the flicker animation
}

        return this.each(function () {
            options.endImage = endImages[thisSeq];
            startSeqs['mainSeq' + startNum]['subSeq' + (++thisSeq)] = {};
            startSeqs['mainSeq' + startNum]['subSeq' + thisSeq]['spinning'] = true;
            var track = {
                total: total,
                mainSeq: startNum,
                subSeq: thisSeq
            };
            (new slotMachine(this, options, track));
        });
    }
};

$.fn.stopSpin = function () {
    if (this.length) {
        if (!$(this).is(':animated')) return; // Return false if this element is not animating
        if ($(this)[0].hasAttribute('data-playslot')) {
            $.each(startSeqs['mainSeq' + $(this).attr('data-playslot')], function(index, obj) {
                obj['spinning'] = false;
            });
        }
    }
};

var slotMachine = function (el, options, track) {
    var slot = this;
    slot.$el = $(el);

    slot.defaultOptions = {
        easing: 'swing',        // String: easing type for final spin
        time: 3000,             // Number: total time of spin animation
        loops: 6,               // Number: times it will spin during the animation
        manualStop: false,      // Boolean: spin until user manually click to stop
        useStopTime: false,     // Boolean: use stop time        
        stopTime: 5000,         // Number: total time of stop animation
        stopSeq: 'random',      // String: sequence of slot machine end animation, random, leftToRight, rightToLeft
        endImage: "",           // String: image URL for end animation
        onEnd : $.noop,         // Function: run on each element spin end, it is passed endImage
        onFinish: $.noop,       // Function: run on all element spin end, it is passed endImage
    };

    slot.spinSpeed = 0;
    slot.loopCount = 0;

    slot.init = function () {
        slot.options = $.extend({}, slot.defaultOptions, options);
        slot.setup();
        slot.startSpin();
    };

    slot.setup = function () {
        var $li = slot.$el.find('li').first();
        slot.liHeight = $li.innerHeight();
        slot.liCount = slot.$el.children().length;
        slot.listHeight = slot.liHeight * slot.liCount;
        slot.spinSpeed = slot.options.time / slot.options.loops;

        $li.clone().appendTo(slot.$el); // Clone to last row for smooth animation

        // Configure stopSeq
        if (slot.options.stopSeq == 'leftToRight') {
            if (track.subSeq != 1) {
                slot.options.manualStop = true;
            }
        } else if (slot.options.stopSeq == 'rightToLeft') {
            if (track.total != track.subSeq) {
                slot.options.manualStop = true;
            }
        }
    };

    slot.startSpin = function () {
        slot.$el
            .css('top', -slot.listHeight)
            .animate({'top': '0px'}, slot.spinSpeed, 'linear', function () {
                slot.lowerSpeed();
            });
            const element = document.querySelector('.slot-machine');
            element.classList.add('animate__animated', 'animate__swing');
            

            setTimeout(() => {
                element.classList.remove('animate__animated', 'animate__swing');
            }, 5000);
    };

    slot.lowerSpeed = function () {
        slot.loopCount++;

        if (slot.loopCount < slot.options.loops ||
            (slot.options.manualStop && startSeqs['mainSeq' + track.mainSeq]['subSeq' + track.subSeq]['spinning'])) {
            slot.startSpin();
        } else {
            slot.endSpin();
        }
    };

    slot.endSpin = function () {
        var finalPos = -((slot.liHeight * imagePaths.length) - slot.liHeight);
        var finalTime = ((slot.spinSpeed * 1.5) * (slot.liCount)) / imagePaths.length;
        if (slot.options.useStopTime) {
            finalTime = slot.options.stopTime;
        }

        slot.$el
            .css('top', -slot.listHeight)
            .animate({'top': finalPos}, parseInt(finalTime), slot.options.easing, function () {
                slot.$el.find('li').last().remove(); // Remove the cloned row

                slot.endAnimation(slot.options.endImage);
                if ($.isFunction(slot.options.onEnd)) {
                    slot.options.onEnd(slot.options.endImage);
                }

                // onFinish is every element is finished animation
                if (startSeqs['mainSeq' + track.mainSeq]['totalSpinning'] == 0) {
                    var totalImages = '';
                    $.each(startSeqs['mainSeq' + track.mainSeq], function(index, subSeqs) {
                        if (typeof subSeqs == 'object') {
                            totalImages += subSeqs['endImage'].toString();
                        }
                    });
                    if ($.isFunction(slot.options.onFinish)) {
                        slot.options.onFinish(totalImages);
                    }
                }
            });
    }

    slot.endAnimation = function(endImage) {
        if (slot.options.stopSeq == 'leftToRight' && track.total != track.subSeq) {
            startSeqs['mainSeq' + track.mainSeq]['subSeq' + (track.subSeq + 1)]['spinning'] = false;
        } else if (slot.options.stopSeq == 'rightToLeft' && track.subSeq != 1) {
            startSeqs['mainSeq' + track.mainSeq]['subSeq' + (track.subSeq - 1)]['spinning'] = false;
        }
        startSeqs['mainSeq' + track.mainSeq]['totalSpinning']--;
        startSeqs['mainSeq' + track.mainSeq]['subSeq' + track.subSeq]['endImage'] = endImage;

        // Update the slot with the end image
        slot.$el.find('li').each(function() {
          //  $(this).css('background-image', 'url(' + endImage + ')');
          //  $(this).css('background-size', 'cover');
        }); 
        
        slot.$el.find('li:last').css({
            'background-image': 'url(' + endImage + ')',
            'background-size': 'cover'
        });

         // INCREASE WINNER SCORE
         let endImageEmployee = null;
         for (let employee of employees) {
            if (employee.ImagePath === endImage) {
                endImageEmployee = employee;
                break;
            }
        }
        confetti({
            particleCount: 400,
            angle: 270,
            spread: 360,
            origin: { y: 0 },
            resize: true,     // Resize confetti canvas when window resizes
        });
        confetti({
            particleCount: 100,
            startVelocity: 30,
            spread: 360,
            origin: {
              x: Math.random(),
              // since they fall down, start a bit higher than random
              y: Math.random() - 0.2
            }
          });
          confetti({
            particleCount: 100,
            startVelocity: 30,
            spread: 360,
            origin: {
              x: Math.random(),
              // since they fall down, start a bit higher than random
              y: Math.random() - 0.2
            }
          });
          confetti({
            particleCount: 100,
            startVelocity: 30,
            spread: 360,
            origin: {
              x: Math.random(),
              // since they fall down, start a bit higher than random
              y: Math.random() - 0.2
            }
          });
          confetti({
            particleCount: 100,
            startVelocity: 30,
            spread: 360,
            origin: {
              x: Math.random(),
              // since they fall down, start a bit higher than random
              y: Math.random() - 0.2
            }
          });

        handleLeaderBoardClick(endImageEmployee);
        incrementScoreForWinner(endImageEmployee.Id);
        updateLeaderboard();

          // Apply styles to the remaining <li> elements
          let liElements = slot.$el.find('li');
          let index = 0;
  
          for (let employee of employees) {
              if (employee.Id !== endImageEmployee.Id) {
                  $(liElements[index]).css({
                      'background-image': 'url(' + employee.ImagePath + ')',
                      'background-size': 'cover'
                  });
                  index++;
              }
          }
    }

    slot.randomRange = function (low, high) {
        return Math.floor(Math.random() * (1 + high - low)) + low;
    };

    this.init();
};

$('#btn-example1').click(function() {
   $('#example1 ul').playSpin({
      endImage: imagePaths[Math.floor(Math.random() * imagePaths.length)] // Use the same random image for all slots
   });
});

    updateLeaderboard();
    // MY FUNCTIONS

    function incrementScoreForWinner(winnderId){
        const index = employees.findIndex(employee => employee.Id === winnderId);
        employees[index].WheelCount += 1;
        saveEmployees();
    }
    function updateLeaderboard() {
        const leaderboard = document.getElementById('leaderboard');
        leaderboard.innerHTML = ''; // Clear existing leaderboard
    
        // Sort employees by WheelCount descending
        employees.sort((a, b) => b.WheelCount - a.WheelCount);
    
        employees.forEach(employee => {
            const li = document.createElement('li');
            li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            li.innerHTML = `
                <span>
                    <img src="${employee.ImagePath}" alt="${employee.Name}" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;">
                    ${employee.Name}: ${(employee.WheelCount/3).toFixed(0)}
                </span>
            `;
    
            // Add click event listener
            li.addEventListener('click', () => handleLeaderBoardClick(employee));
    
            leaderboard.appendChild(li);
        });
    }

    function handleLeaderBoardClick(employee) {
        const body = document.querySelector('body');

        switch (employee.Id) {
            case 1:
              body.style.backgroundImage = 'url("/images/patterns/MaoCosmos.jpg")';
              break;
            case 2:
                body.style.backgroundImage = 'url("/images/patterns/ArchilNerd.jpg")';
              break;
            case 3:
                body.style.backgroundImage = 'url("/images/patterns/MJKhostar.jpg")';
              break;
            case 4:
                body.style.backgroundImage = 'url("/images/patterns/ArsenaMwvadi.jpg")';
              break;
            case 5:
                body.style.backgroundImage = 'url("/images/patterns/TabagariChiatura.jpg")';
              break;
            case 6:
                body.style.backgroundImage = 'url("/images/patterns/NikaMoto.jpg")';
              break;
            case 7:
                body.style.backgroundImage = 'url("/images/patterns/MariamHello.jpg")';
              break;
            case 8:
                body.style.backgroundImage = 'url("/images/patterns/ZuraGuns.jpg")';
              break;
            case 9:
                body.style.backgroundImage = 'url("/images/patterns/BidzoCars.jpg")';
          }
    }
});
