import SceneGridCell from "./SceneGridCell";

export default class SceneGrid {
  id: number = 0;
  name: string;
  grid: Array<Array<SceneGridCell>> = [[new SceneGridCell()]];

  constructor(init?: Partial<SceneGrid>) {
    Object.assign(this, init);

    for (let r = 0; r < this.grid.length; r++) {
      for (let c = 0; c < this.grid[r].length; c++) {
        if (typeof this.grid[r][c] == 'number') {
          this.grid[r][c] = new SceneGridCell({sceneID: (this.grid[r][c] as any)})
        }
      }
    }
  }
}