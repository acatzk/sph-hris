export enum PositionEnum {
  MANAGER = 1,
  ASSISTANT_MANAGER = 2,
  ADMIN = 3,
  WEB_DEVELOPER = 4,
  ESL_TEACHER = 5,
  WEB_DEVELOPER_TRAINER = 6,
  WEB_DEVELOPER_TEAM_LEADER = 7,
}

export class PositionHelper {
  public static ALL_LEADERS: PositionEnum[] = [
    PositionEnum.ADMIN,
    PositionEnum.WEB_DEVELOPER_TEAM_LEADER,
    PositionEnum.WEB_DEVELOPER_TRAINER,
  ];

  public static isLeader(position: PositionEnum): boolean {
    return this.ALL_LEADERS.includes(position);
  }
}
