/** Class to represent a participant.*/
class ParticipantData {

    /**@type {string} */
    #color;
    /**@type {number} */
    #id; 
    /**@type {number} */
    #score;
    
    /**
     * Create a participant
     * @param {string} color - Participant's color.
     * @param {string} id - Participant's id.
     * @param {number} [score = 0] - Participant's current points.
     */
    constructor(color, id) {
        this.#color = color;
        this.#id = id;
        this.#score = 0;
    }
    get color() {
        return this.#color;
    }
    get score() {
        return this.#score;
    }
    set newScore(number) {
        this.#score = number;
    }
    get id() {
        return this.#id;
    }
    /** Increment participant's score by 1 */
    progress = () => {
        // console.log(`In progress: this = ${this}`);
        // console.log(`this.score = ${this.score}`);
        return this.newScore = this.score +1;
        // console.log(`this.score = ${this.score}`);
    };
    /** Reset participant's score to 0 */
    reset() {
        this.score = 0;
    }
}
class RaceControler {
    
    /** @type {ParticipantData[]} */
    #participants;
    /** @type {Element} */
    #canvas;
    /** @type {number} */
    #winner;
    /** @type {object} */
    #representations;
    /** @type {Array} */
    #diamonds;
    /** @type {Array} */
    #rectangles;
    /** @type {Array} */
    #boxes;

    /** 
     * @param {string[]} colors - The participants' colors.
     * @param {Element} canvas - the html element where the start and finish line are draw.
     */
    constructor(colors, canvas) {

        this.#canvas = canvas;
        this.#participants = new Map;
        this.#representations = {};
        this.#diamonds = [];
        this.#rectangles = [];
        this.#boxes = [];

        for (let i = 0; i < colors.length; ++i) {
            const color = colors[i];
            const id = i;
            this.participantsList.set(`${i}`,{
                data: new ParticipantData(color, id), 
                representation: new ParticipantRepresentation(color, id, this.canvas)});

            // The Event Listener is declared here because 
            // by doing so "this" refers to the RaceControler instance.
            this.participantsList.get(`${i}`)["representation"].diamond.addEventListener("click", this.moveDiamond);
        }
        this.#winner = -1;
    }
    get canvas() {
        return this.#canvas;
    }
    get participantsList() {
        return this.#participants;
    }
    get diamonds() {
        return this.#diamonds;
    }
    get rectangles() {
        return this.#rectangles;
    }
    get boxes() {
        return this.#boxes;
    }
    drawLine = (xPos,yPos, width, height, context) => {
        context.fillRect(xPos,yPos, width, height);
    };
    writeText = (message, xPos, yPos, context) => {
        context.font = "bold 12pt times";
        context.fillText(message, xPos, yPos);  
    };
    createButton = (xPos, yPos) => {
        this.resetButton = document.createElement("button");
        this.resetButton.textContent = "Reset";
        this.resetButton.style.left = `${xPos}px`;
        this.resetButton.style.top = `${yPos}px`;
        this.canvas.insertAdjacentElement("afterend", this.resetButton);
        this.resetButton.addEventListener("click", this.resetRace);
    };
    /** Reset all the participant to score 0 */
    resetRace() {
        for (const participant of this.#participants) {
            participant.reset();
        }
    }
    /**
     * Check if there a participant with score equals 10.
     * @returns {string|null}
     */
    getWinnerId() {
        for (const participant of this.#participants) {
            if (participant.score == 10) {
                return participant.id;
            }
        }
        return null;
    }
    /** 
     * Given a participant id returns the participant's color else null.
     * @returns {string|null}
     */
    getParticipantColor(id) {      
        if (this.participants[`${id}`]) {
            return this.participants[`${id}`].partColor;
        }
        return null;
    }
    /**
     * Given a participant's id returns the partipant's score else null 
     * @returns {strig|null}
    */
    getParticipantScore(id) {
        if (this.participants[`${id}`]) {
            return this.participants[`${id}`].score;
        }
        return null;
    }
    /** 
     * Function to increment participant score by 1 point, clicking 
     * on the <div> that represent that participant, and move it accordingly.
     */
    moveDiamond =(e)=> {    
        const index = e.target.dataset.id;
        const step = this.participantsList.get(`${index}`)["data"].progress();

        this.participantsList.get(`${index}`)["representation"].diamond.style.left = `${(50*step)+109}px`;
        this.participantsList.get(`${index}`)["representation"].box.innerHTML = step;

        if (step === 10) {
            this.participantsList.get(`${index}`)["representation"].box.style.color = "red";
            this.freezeDiamonds();
        }      
    };
    /** Removes the Event Listener from the diamonds */

    // Change it for a method that simply removes if there is any or 
    // set up one if there isn't.
    freezeDiamonds() {
        for (const participant of this.participantsList) {
            participant[1]["representation"].diamond.removeEventListener("click", this.moveDiamond);
        }
    }
    /** Brings back the original Event Listener to the diamonds */
    unfreezeDiamonds() {
        for (const participant of this.#participants) {
            participant[1]["representation"].diamond.addEventListener("click", this.moveDiamond);        }
    }
}
class ParticipantRepresentation{
    /** @type {string} */
    #color;
    /** @type {number} */
    #id;
    /** @type {number} */
    #score;
    /** @type {Element} */
    #canvas;
    /** @type {Element} */
    #diamond;
    /** @type {Element} */  
    #rectangle;
    /** @type {Element} */
    #box;

    constructor(color, id, canvas){
        
        this.#color = color;
        this.#id = id;
        this.#score = 0;
        this.#canvas = canvas;
        this.#diamond = document.createElement("div");
        this.#diamond.className = "diamond";
        this.#diamond.dataset.id = `${this.#id}`;
        this.#canvas.insertAdjacentElement("afterend", this.#diamond);
        // this.#diamond.addEventListener ("click", RaceControler.moveDiamond);
        this.#diamond.style.background = this.#color;
        this.#diamond.style.left = `${(50*this.#score)+109}px`;
        this.#diamond.style.top = `${(60*this.#id)+103}px`;

        this.#rectangle = document.createElement("div");
        this.#rectangle.setAttribute("class","rectangle");
        this.#rectangle.setAttribute("id", this.#color);
        this.#canvas.insertAdjacentElement("afterend", this.#rectangle);
        this.#rectangle.style.background = this.#color;
        this.#rectangle.style.left = `${700}px`;
        this.#rectangle.style.top = `${(20*this.#id)+175}px`;

        this.#box = document.createElement("div");
        this.#box.setAttribute("class","scoreBox");
        this.#box.innerHTML = this.#score;
        this.#canvas.insertAdjacentElement("afterend", this.#box);
        this.#box.style.left = `${700}px`;
        this.#box.style.top = `${(20*this.#id)+174}px`;
    }
    get diamond() {
        return this.#diamond;
    }
    get rectangle() {
        return this.#rectangle;
    }    
    get box() {
        return this.#box;
    }
}

window.onload = function init() {
    
    const canvas1 = document.getElementById("race_track");
    const ctx = canvas1.getContext("2d");

    const diamondRace1 = new RaceControler(["red", "blue", "green", "yellow"], canvas1);
    diamondRace1.drawLine(17, 17, 2, 252.32, ctx);
    diamondRace1.drawLine(517, 17, 2,252.32, ctx);
    diamondRace1.writeText("Start", 0, 12, ctx);
    diamondRace1.writeText("End", 503, 12, ctx);
    diamondRace1.writeText("Score Board", 594, 95, ctx);
    diamondRace1.createButton(700,100);
    // diamondRace1.representParticipants();

};