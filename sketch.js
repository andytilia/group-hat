import EnrollmentSystem from './EnrollmentSystem.js';
import RandomAssignmentStrategy from './RandomAssignmentStrategy.js';
import GeneticAlgorithmStrategy from './GeneticAlgorithmStrategy.js';

let cellWidth = 130;
let cellHeight = 20;
let cellBuffer = 4;
let initialX = 10; // Starting X position
let initialY = 50; // Starting Y position
let yOffset = cellHeight + cellBuffer; // Space between members vertically
let xOffset = cellWidth + cellBuffer; // Space between columns
let groupData;
let memberData;
let membersPerColumn;
let system;

const sketch = (p5) => {
  p5.preload = () => {
    groupData = p5.loadTable('test-groups.csv', 'header');
    memberData = p5.loadTable(
      'data-2023-08-08-18-44-04.csv',
      'header'
    );
  };

  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    membersPerColumn =
      Math.floor((p5.windowHeight - initialY) / yOffset) - 3;
    system = new EnrollmentSystem(p5, new GeneticAlgorithmStrategy());
    const numMembers = system.createMembers(
      memberData,
      membersPerColumn,
      initialX,
      initialY,
      xOffset,
      yOffset,
      cellWidth,
      cellHeight
    );
    const numGroups = system.createGroups(
      groupData,
      membersPerColumn,
      numMembers,
      initialY,
      xOffset,
      cellWidth,
      cellHeight,
      cellBuffer
    );
    p5.resizeCanvas(
      (numGroups + Math.ceil(numMembers / membersPerColumn)) *
        (cellWidth + cellBuffer) +
        300,
      numMembers * (cellHeight + cellBuffer) + 300
    );
    system.autoPlaceMembers();
  };

  p5.draw = () => {
    p5.background(255);

    system.groups.forEach((group) => {
      group.show();
      group.showTitle();
    });

    system.members.forEach((member) => {
      member.show();
      if (member.dragging) {
        member.move();
      }
    });
    system.showStats(10, 20);
  };
  p5.mousePressed = () => {
    // If a member was clicked, start dragging it
    for (let member of system.members) {
      if (member.isMouseOver()) {
        system.startDraggingMember(member);
        break;
      }
    }
  };

  p5.mouseReleased = () => {
    system.onMouseReleased();
  };

  p5.keyPressed = () => {
    if (p5.key === 'c') {
      system.copyAssignments(membersPerColumn);
    }
  };

  // p5.windowResized = () => {
  //   p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  // };
};

const myp5 = new p5(sketch, 'enroll');

let saveButton = document.getElementById('saveSystem');
let loadButton = document.getElementById('loadSystem');
let fileInput = document.getElementById('loadFile');

saveButton.addEventListener('click', () => {
  let dataStr =
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(system.toJSON());
  let downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', 'systemState.json');
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
});

loadButton.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', (event) => {
  let file = event.target.files[0];
  if (file) {
    let reader = new FileReader();
    reader.onload = function (e) {
      system.fromJSON(e.target.result);
      // You might need to call any render or update functions to refresh the UI
    };
    reader.readAsText(file);
  }
});
