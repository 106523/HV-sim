
let lastTimestamp = 0; // Outside of the function wrapping the code below
   //

setInterval(function(){RegularLoop(); }, 1);
function RegularLoop() {
  const timestamp = Math.max(Math.round(Date.now() / 1000), lastTimestamp + 1);
lastTimestamp = timestamp;
console.log(timestamp)
}
