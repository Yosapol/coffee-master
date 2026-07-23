const brewers = [
  {
    name: "James Hoffmann",
    note: "Coffee author and educator",
    recipes: [
      { name: "Ultimate V60", specs: ["30 g", "500 g", "1:16.7", "Hot", "Medium-fine", "3:30"], steps: ["0:00|Bloom with 60 g and swirl.", "0:45|Pour to 300 g by 1:15.", "1:15|Pour to 500 g by 1:45, stir, then finish with a gentle swirl."], source: "https://www.hario-usa.com/blogs/recipes-and-more-from-friends/james-hoffmann-uitimate-v60-technique" },
      { name: "Better 1 Cup", specs: ["15 g", "250 g", "1:16.7", "Hot", "Medium-fine", "3:00"], steps: ["0:00|Pour 50 g and swirl.", "0:45|Pour to 100 g.", "1:10-1:50|Add three more 50 g pours, then swirl after the last pour."], source: "https://www.youtube.com/watch?v=1oB1oDrDkHM" },
      { name: "Chemex", specs: ["30 g", "500 g", "1:16.7", "100 C", "Medium", "4:15"], steps: ["0:00|Bloom with 60-90 g and swirl.", "0:45|Pour steadily to 300 g.", "1:15|Continue to 500 g, stir gently, then let the thick filter drain."], source: "https://honestcoffeeguide.com/brew-recipes/james-hoffmann-chemex-recipe/" }
    ]
  },
  {
    name: "Tetsu Kasuya",
    note: "2016 World Brewers Cup champion",
    recipes: [
      { name: "4:6 Method", specs: ["20 g", "300 g", "1:15", "92 C", "Coarse", "3:30"], steps: ["0:00|Pour 50 g for a sweeter opening.", "0:45|Pour 70 g to complete the first 40%.", "1:30-2:40|Finish with three 60 g pours."], source: "https://www.hario.co.uk/blogs/hario-ambassadors/hario-v60-recipe-interview-with-hario-ambassador-tetsu-kasuya" },
      { name: "Devil Switch", specs: ["20 g", "280 g", "1:14", "93 / 70 C", "Medium", "3:00"], steps: ["0:00|Switch open: pour 60 g.", "0:30|Pour to 120 g, then cool the remaining water.", "1:15|Close, pour to 280 g, then open at 1:45."], source: "https://outpostcoffee.com/blogs/brew-at-home/tetsu-kasuyas-hario-switch-recipe-for-perfect-coffee" },
      { name: "Neo 10-Pour", specs: ["20 g", "300 g", "1:15", "95-96 C", "Very coarse", "3:30"], steps: ["0:00|Begin with a flat, very coarse coffee bed.", "Every 20 sec|Make ten even 30 g pours.", "Finish|Keep agitation low and allow the final pour to draw down."], source: "https://brewtuner.io/recipes/v60" }
    ]
  },
  {
    name: "Scott Rao",
    note: "Coffee consultant and author",
    recipes: [
      { name: "One-Pour V60", specs: ["22 g", "340 g", "1:15.5", "Near boil", "Medium-fine", "2:15+"], steps: ["0:00|Bloom with about 66 g and remove dry pockets.", "0:45|Use one controlled main pour to reach 340 g.", "After pour|Finish with one gentle Rao Spin."], source: "https://www.scottrao.com/blog/2017/9/14/v60-video" },
      { name: "Two-Pour V60", specs: ["22 g", "340 g", "1:15.5", "Near boil", "Medium", "2:45+"], steps: ["0:00|Bloom thoroughly and agitate.", "0:45|Make the first main pour.", "After 30-40 sec|Complete the second pour and spin gently for a flat bed."], source: "https://www.scottrao.com/blog/2017/9/14/v60-video" },
      { name: "Pulsar", specs: ["25 g", "425 g", "1:17", "Near boil", "Coarse", "3:30-4:30"], steps: ["0:00|Pour 75 g with valve open, then close for the bloom.", "0:45|Top up, open the valve, and maintain a shallow slurry.", "Final pour|Swirl gently and let the brewer drain."], source: "https://www.scottrao.com/blog/pulsar-recipe" }
    ]
  },
  {
    name: "Lance Hedrick",
    note: "Barista and coffee educator",
    recipes: [
      { name: "Ultimate Two-Pour", specs: ["20 g", "320 g", "1:16", "93 C", "Medium-fine", "2:30-4:00"], steps: ["0:00|Bloom with 60 g and excavate dry pockets.", "1:00-2:00|Pour the remaining 260 g in one steady stream.", "Drawdown|Use pour height and flow to control agitation."], source: "https://www.tmrw.coffee/methods/v60-lance-hedrick" },
      { name: "1-2-1", specs: ["18 g", "306 g", "1:17", "100 C", "Medium-fine", "3:50"], steps: ["0:00|Bloom with 54 g and swirl thoroughly.", "2:00|Pour continuously to 306 g.", "2:45|Swirl gently and let the bed drain."], source: "https://gota.cafe/en/recipes/v60-02/hedrick-121" },
      { name: "Easy Effective", specs: ["20 g", "340 g", "1:17", "99 C", "Medium-fine", "3:30"], steps: ["0:00|Pour 50 g and spin.", "0:30|Pour to 100 g; continue to 220 g at 1:00.", "1:30|Pour to 340 g and finish with a light spin."], source: "https://www.timer.coffee/recipes/v60/easy-and-effective-v60-by-lance-hedrick/" }
    ]
  },
  {
    name: "Matt Winton",
    note: "2021 World Brewers Cup champion",
    recipes: [
      { name: "Five-Pour V60", specs: ["20 g", "300 g", "1:15", "93 C", "Coarse", "3:30"], steps: ["0:00|Pour 60 g and bloom for 30 seconds.", "0:30|Add another energetic 60 g pour.", "Every 30 sec|Repeat until reaching 300 g."], source: "https://magazine.coffee/blog/1/6920/interview-playing-the-game-with-matt-winton-brewing-champion" },
      { name: "Competition V60", specs: ["20 g", "300 g", "1:15", "93 / 88 C", "Coarse", "2:40"], steps: ["0:00|Bloom with 60 g using 93 C water.", "0:30 onward|Use four more 60 g pours with cooler 88 C water.", "Finish|Pour energetically for agitation without stirring."], source: "https://tmrw.coffee/methods/v60-matt-winton" },
      { name: "Switch Immersion", specs: ["16 g", "240 g", "1:15", "93 C", "Coarse", "4:00"], steps: ["0:00|Switch open: bloom with 50 g.", "0:30|Close and pour to 240 g.", "3:00|Open the Switch and remove it at 4:00."], source: "https://device.report/m/72917ba42da74d8b720db061e3a2a03432a7bc053440dcca97fd6ed996e7c02c.pdf" }
    ]
  },
  {
    name: "Patrik Rolf / April",
    note: "April Coffee founder and brewer",
    recipes: [
      { name: "April Filter", specs: ["14 g", "238 g", "1:17", "96-99 C", "Dial by time", "2:20-3:00"], steps: ["0:00|Bloom with twice the coffee weight and stir.", "After bloom|Pour slowly in a small circle near the center.", "Finish|Stir once more and adjust grind by total time."], source: "https://www.aprilcoffeeroastery.com/filter" },
      { name: "April Brewer WBrC", specs: ["12 g", "200 g", "1:16.7", "93 C", "Medium", "2:40"], steps: ["0:00|Pour 100 g with controlled circular movement.", "0:35|Pour the remaining 100 g.", "Finish|Let the flat bed drain evenly."], source: "https://gota.cafe/en/authors/patrik-rolf" },
      { name: "Six Pulses V60", specs: ["20 g", "300 g", "1:15", "Hot", "Coarse", "3:30"], steps: ["0:00|Begin with a 50 g pulse.", "Every 30 sec|Repeat five more energetic 50 g pours.", "Finish|Let each pulse fall close to the bed before the next."], source: "https://gota.cafe/en/authors/patrik-rolf" }
    ]
  },
  {
    name: "Park Thotsathep 'Brewboy'",
    note: "Thai brewer, roaster, and Terroir.BKK founder",
    recipes: [
      { name: "Solo Dripper 12.5 g", specs: ["12.5 g", "Per guide", "Coffee-led", "Per coffee", "Per coffee", "Official card"], steps: ["Prepare|Choose Brewboy's 12.5 g Solo Dripper guide.", "Brew|Follow the current coffee-specific card supplied by Brewboy.", "Adjust|Change grind first if the drawdown or taste misses the guide."], source: "https://www.projectbrewboy.com/" },
      { name: "CT62 12.5 g", specs: ["12.5 g", "Per guide", "Coffee-led", "Per coffee", "CT62", "Official card"], steps: ["Prepare|Use the CT62 recipe listed in Brewboy's 12.5 g guide set.", "Brew|Keep the dripper and coffee-specific parameters from the official card.", "Adjust|Use taste and drawdown before changing the ratio."], source: "https://www.projectbrewboy.com/" },
      { name: "CT Transits 12.5 g", specs: ["12.5 g", "Per guide", "Coffee-led", "Per coffee", "CT Transits", "Official card"], steps: ["Prepare|Use Brewboy's CT Transits 12.5 g recipe card.", "Brew|Follow its current pour schedule rather than substituting another dripper's settings.", "Adjust|Fine-tune the grind for the coffee being served."], source: "https://www.projectbrewboy.com/" }
    ]
  }
];

const specLabels = ["Coffee", "Water", "Ratio", "Water", "Grind", "Target"];
const recipeGrid = document.querySelector("#recipeGrid");

function renderRecipe(card, recipe) {
  card.querySelector(".recipe-origin").textContent = recipe.name;
  card.querySelector(".recipe-specs").innerHTML = recipe.specs.map((value, index) =>
    `<span><strong>${value}</strong>${specLabels[index]}</span>`
  ).join("");
  card.querySelector(".pour-steps").innerHTML = recipe.steps.map((step) => {
    const [time, text] = step.split("|");
    return `<li><time>${time}</time><span>${text}</span></li>`;
  }).join("");
  const source = card.querySelector(".recipe-source");
  source.href = recipe.source;
  source.innerHTML = `Open source recipe <span aria-hidden="true">&#8599;</span>`;
}

brewers.forEach((brewer, brewerIndex) => {
  const card = document.createElement("article");
  card.className = "recipe-card";
  card.innerHTML = `
    <header class="recipe-card-header">
      <span class="recipe-number">${String(brewerIndex + 1).padStart(2, "0")}</span>
      <div>
        <p class="recipe-by">${brewer.name}</p>
        <h2>${brewer.note}</h2>
        <p class="recipe-origin"></p>
      </div>
    </header>
    <div class="recipe-menu" role="group" aria-label="${brewer.name} recipe menu"></div>
    <div class="recipe-specs" aria-label="Recipe specifications"></div>
    <ol class="pour-steps"></ol>
    <a class="recipe-source" target="_blank" rel="noopener"></a>`;

  const menu = card.querySelector(".recipe-menu");
  brewer.recipes.forEach((recipe, recipeIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `recipe-choice${recipeIndex === 0 ? " active" : ""}`;
    button.textContent = recipe.name;
    button.setAttribute("aria-pressed", recipeIndex === 0 ? "true" : "false");
    button.addEventListener("click", () => {
      menu.querySelectorAll(".recipe-choice").forEach((choice) => {
        choice.classList.toggle("active", choice === button);
        choice.setAttribute("aria-pressed", choice === button ? "true" : "false");
      });
      renderRecipe(card, recipe);
    });
    menu.appendChild(button);
  });

  renderRecipe(card, brewer.recipes[0]);
  recipeGrid.appendChild(card);
});
