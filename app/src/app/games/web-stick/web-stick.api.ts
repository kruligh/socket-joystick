export type ApiMethod = Init | Message | Move;

export interface Init {
  type: 'init';
  payload: {};
}

export interface Message {
  type: 'message';
  payload: {
    content: string;
  };
}

export interface Move {
  type: 'move';
  payload: {
    x: number;
    y: number;
    z: number;
  };
}
