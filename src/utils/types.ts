export interface County {
  id: number;
  name: string;
}

export interface Municipality {
  id: number;
  name: string;
}

export enum SelectMode {
  INFO_MODAL = 'INFO_MODAL',
  SET_POSITION = 'SET_POSITION',
}
