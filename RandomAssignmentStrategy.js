export default class RandomAssignmentStrategy {
  autoPlace(system) {
    const assignment = [];
    const availableGroups = system.groups.map((group) => ({
      name: group.name,
      availableSeats: group.seats.filter((seat) => !seat.isOccupied())
        .length,
    }));

    for (let member of system.members) {
      const randomGroup =
        this.getRandomGroupWithAvailableSeat(availableGroups);
      if (randomGroup) {
        assignment.push({
          memberName: member.name,
          groupName: randomGroup.name,
        });
        randomGroup.availableSeats--; // Decrement available seats
      }
    }
    // console.log(assignment);
    return assignment;
  }

  getRandomGroupWithAvailableSeat(groups) {
    const groupsWithAvailableSeats = groups.filter(
      (group) => group.availableSeats > 0
    );
    return groupsWithAvailableSeats[
      Math.floor(Math.random() * groupsWithAvailableSeats.length)
    ];
  }
}
