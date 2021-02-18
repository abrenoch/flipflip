import * as React from "react";
import clsx from "clsx";
import Draggable, {DraggableData} from "react-draggable";

import {
  AppBar, Button, Container, createStyles, Fab, IconButton, ListItemText, Menu, MenuItem, TextField, Theme, Toolbar,
  Tooltip, Typography, withStyles
} from "@material-ui/core";

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DeleteIcon from '@material-ui/icons/Delete';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';

import {SGT} from "../../data/const";
import SceneSelect from "../configGroups/SceneSelect";
import SceneGrid from "../../data/SceneGrid";
import Scene from "../../data/Scene";
import SceneGridCell from "../../data/SceneGridCell";

const styles = (theme: Theme) => createStyles({
  root: {
    display: 'flex',
    height: '100vh',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  appBarSpacer: {
    ...theme.mixins.toolbar
  },
  title: {
    textAlign: 'center',
    flexGrow: 1,
  },
  headerBar: {
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    flexWrap: 'nowrap',
  },
  headerLeft: {
    flexBasis: '13%',
  },
  headerRight: {
    flexBasis: '13%',
    justifyContent: 'flex-end',
    display: 'flex',
  },
  titleField: {
    margin: 0,
    textAlign: 'center',
    flexGrow: 1,
  },
  titleInput: {
    color: theme.palette.primary.contrastText,
    textAlign: 'center',
    fontSize: theme.typography.h4.fontSize,
  },
  noTitle: {
    width: '33%',
    height: theme.spacing(7),
  },
  content: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    backgroundColor: theme.palette.background.default,
  },
  container: {
    height: '100%',
    padding: theme.spacing(0),
  },
  dimensionInput: {
    color: `${theme.palette.primary.contrastText} !important`,
    minWidth: theme.spacing(6),
  },
  grid: {
    flexGrow: 1,
    display: 'grid',
    height: '100%',
  },
  gridCell: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sceneMenu: {
    minHeight: 365,
    minWidth: 250,
  },
  deleteButton: {
    backgroundColor: theme.palette.error.dark,
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
    zIndex: 3,
  },
  deleteIcon: {
    color: theme.palette.error.contrastText,
  },
  fill: {
    flexGrow: 1,
  },
  backdropTop: {
    zIndex: theme.zIndex.modal + 1,
  },
  highlight: {
    borderWidth: 2,
    borderColor: theme.palette.secondary.main,
    borderStyle: 'solid',
  },
  disable: {
    pointerEvents: 'none',
  }
});

class GridSetup extends React.Component {
  readonly props: {
    classes: any,
    allScenes: Array<Scene>,
    autoEdit: boolean,
    scene: SceneGrid,
    tutorial: string,
    goBack(): void,
    onDelete(grid: SceneGrid): void,
    onPlayGrid(grid: SceneGrid): void,
    onTutorial(tutorial: string): void,
    onUpdateGrid(grid: SceneGrid, fn: (grid: SceneGrid) => void): void,
  };

  readonly state = {
    isEditingName: this.props.autoEdit ? this.props.scene.name : null as string,
    isEditing: null as Array<number>,
    menuAnchorEl: null as any,
    height: this.props.scene.grid && this.props.scene.grid.length > 0 &&
    this.props.scene.grid[0].length ? this.props.scene.grid.length : 1,
    width: this.props.scene.grid && this.props.scene.grid.length > 0 &&
    this.props.scene.grid[0].length > 0 ? this.props.scene.grid[0].length : 1,
    dragging: false,
  };

  readonly nameInputRef: React.RefObject<HTMLInputElement> = React.createRef();

  _colors = ["#FF0000", "#FFA500", "#FFFF00", "#008000", "#0000FF", "#EE82EE", "#4B0082"]

  render() {
    const classes = this.props.classes;

    const colSize = 100 / this.state.width;
    const rowSize = 100 / this.state.height;
    let gridTemplateColumns = "";
    let gridTemplateRows = "";
    for (let w = 0; w < this.state.width; w++) {
      gridTemplateColumns += colSize.toString() + "% ";
    }
    for (let h = 0; h < this.state.height; h++) {
      gridTemplateRows += rowSize.toString() + "% ";
    }

    let count = 0;
    let colors = Array<Array<string>>();
    for (let r = 0; r < this.state.height; r++) {
      let row = Array<string>();
      for (let c = 0; c < this.state.width; c++) {
        row.push("");
      }
      colors.push(row);
    }
    for (let r = 0; r < this.props.scene.grid.length; r++) {
      for (let c = 0; c < this.props.scene.grid[r].length; c++) {
        const cell = this.props.scene.grid[r][c];
        if (cell.sceneCopy && cell.sceneCopy.length > 0) {
          let color = colors[cell.sceneCopy[0]][cell.sceneCopy[1]];
          if (color == "") {
            color = this._colors[count++];
            colors[cell.sceneCopy[0]][cell.sceneCopy[1]] = color;
          }
          colors[r][c] = color;
        }
      }
    }

    return(
      <div className={classes.root}>

        <AppBar position="absolute" className={clsx(classes.appBar, this.props.tutorial == SGT.dimensions && classes.backdropTop)}>
          <Toolbar className={classes.headerBar}>
            <div className={classes.headerLeft}>
              <Tooltip title="Back" placement="right-end">
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="Back"
                  className={clsx(this.props.tutorial == SGT.dimensions && classes.disable)}
                  onClick={this.goBack.bind(this)}>
                  <ArrowBackIcon />
                </IconButton>
              </Tooltip>
            </div>

            {this.state.isEditingName != null && (
              <form onSubmit={this.endEditingName.bind(this)} className={classes.titleField}>
                <TextField
                  autoFocus
                  fullWidth
                  id="title"
                  value={this.state.isEditingName}
                  margin="none"
                  ref={this.nameInputRef}
                  inputProps={{className: classes.titleInput}}
                  onBlur={this.endEditingName.bind(this)}
                  onChange={this.onChangeName.bind(this)}
                />
              </form>
            )}
            {this.state.isEditingName == null && (
              <Typography component="h1" variant="h4" color="inherit" noWrap
                          className={clsx(classes.title, this.props.scene.name.length == 0 && classes.noTitle, this.props.tutorial == SGT.dimensions && classes.disable)} onClick={this.beginEditingName.bind(this)}>
                {this.props.scene.name}
              </Typography>
            )}

            <div className={classes.headerRight}>
              <TextField
                label="Height"
                margin="dense"
                value={this.state.height}
                onChange={this.onHeightInput.bind(this)}
                onBlur={this.blurHeight.bind(this)}
                variant="filled"
                className={clsx(this.props.tutorial == SGT.dimensions && classes.highlight)}
                InputLabelProps={{className: classes.dimensionInput}}
                inputProps={{
                  className: classes.dimensionInput,
                  min: 1,
                  max: 5,
                  type: 'number',
                }}/>
              <TextField
                label="Width"
                margin="dense"
                value={this.state.width}
                onChange={this.onWidthInput.bind(this)}
                onBlur={this.blurWidth.bind(this)}
                variant="filled"
                className={clsx(this.props.tutorial == SGT.dimensions && classes.highlight)}
                InputLabelProps={{className: classes.dimensionInput}}
                inputProps={{
                  className: classes.dimensionInput,
                  min: 1,
                  max: 5,
                  type: 'number',
                }}/>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="Play"
                className={clsx(this.props.tutorial == SGT.dimensions && classes.disable)}
                onClick={this.onPlayGrid.bind(this)}>
                <PlayCircleOutlineIcon fontSize="large"/>
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>

        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth={false} className={classes.container}>
            <div className={classes.grid}
                 style={{gridTemplateColumns: gridTemplateColumns, gridTemplateRows: gridTemplateRows}}>
              {this.props.scene.grid.map((row, rowIndex) =>
                <React.Fragment key={rowIndex}>
                  {row.map((cell, colIndex) => {
                    let scene = this.props.allScenes.find((s) => s.id == cell.sceneID);
                    let sceneCopy = null;
                    if (cell.sceneCopy && cell.sceneCopy.length > 0) {
                      sceneCopy = this.props.allScenes.find((s) => s.id == this.props.scene.grid[cell.sceneCopy[0]][cell.sceneCopy[1]].sceneID);
                    }
                    return (
                      <Draggable
                        key={colIndex}
                        bounds='#app'
                        position={{x:0,y:0}}
                        defaultClassNameDragging={classes.dragging}
                        onStop={this.onDragStop.bind(this, rowIndex, colIndex)}
                        onDrag={this.onDrag.bind(this)}
                      >
                        <Button
                          id={rowIndex + "-" + colIndex}
                          className={classes.gridCell}
                          style={colors[rowIndex][colIndex] == "" ? {} : {borderStyle: 'solid', borderWidth: 10, borderColor: colors[rowIndex][colIndex]}}
                          variant="outlined">
                          {scene ? scene.name : sceneCopy ? "*" + sceneCopy.name + "*" : ""}
                        </Button>
                      </Draggable>
                    );
                  })}
                </React.Fragment>
              )}
            </div>
            <Menu
              id="scene-menu"
              elevation={1}
              anchorOrigin={{
                vertical: 'center',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              getContentAnchorEl={null}
              anchorEl={this.state.menuAnchorEl}
              keepMounted
              classes={{paper: classes.sceneMenu}}
              open={!!this.state.isEditing}
              onClose={this.onCloseMenu.bind(this)}>
              {!!this.state.isEditing &&
                <SceneSelect
                  scene={null}
                  allScenes={this.props.allScenes}
                  value={this.props.scene.grid[this.state.isEditing[0]][this.state.isEditing[1]]}
                  menuIsOpen
                  autoFocus
                  onlyExtra
                  getSceneName={this.getSceneName.bind(this)}
                  onChange={this.onChooseScene.bind(this)}
                  />
              }
            </Menu>
            <Fab
              className={classes.deleteButton}
              onClick={this.props.onDelete.bind(this, this.props.scene)}
              size="small">
              <DeleteIcon className={classes.deleteIcon}/>
            </Fab>
          </Container>
        </main>
      </div>
    );
  }

  componentDidUpdate() {
    // TODO Make sure Grid tutorial works
    //      Probably need to rework state saving for grid like was done for scene/library
    if (this.props.tutorial == SGT.dimensions && this.state.width ==2 && this.state.height == 2) {
      this.props.onTutorial(SGT.dimensions);
      const sceneID = this.props.allScenes[0].id;
      const newGrid = this.props.scene.grid;
      newGrid[0][0].sceneID = sceneID;
      newGrid[0][1].sceneID = sceneID;
      newGrid[1][0].sceneID = sceneID;
      newGrid[1][1].sceneID = sceneID;
      this.changeKey('grid', newGrid);
    }
  }

  onChooseScene(sceneID: number) {
    const row = this.state.isEditing[0];
    const col = this.state.isEditing[1];
    const newGrid = this.props.scene.grid;
    newGrid[row][col].sceneID = sceneID;
    newGrid[row][col].sceneCopy = [];
    this.changeKey('grid', newGrid);
    this.onCloseMenu();
  }

  onCloseMenu() {
    this.setState({isEditing: null});
  }

  getNewGrid(height: number, width: number) {
    let grid = this.props.scene.grid;

    // Adjust height
    if (grid.length > height) {
      grid.splice(height, grid.length - height);
    } else if (grid.length < height) {
      const newRow = Array<SceneGridCell>(width);
      for (let c = 0; c < newRow.length; c++) {
        newRow[c] = new SceneGridCell();
      }
      grid.push(newRow);
    }
    // Adjust width
    for (let row of grid) {
      if (row.length > width) {
        row.splice(width, row.length - width);
      } else if (row.length < width) {
        while (row.length < width) {
          row.push(new SceneGridCell());
        }
      }
    }
    return grid;
  }

  onUpdateHeight(height: number) {
    const grid = this.getNewGrid(height, this.state.width);
    this.changeKey('grid', grid);
    this.setState({height: height});
  }

  onUpdateWidth(width: number) {
    const grid = this.getNewGrid(this.state.height, width);
    this.changeKey('grid', grid);
    this.setState({width: width});
  }

  onHeightInput(e: MouseEvent) {
    const input = (e.target as HTMLInputElement);
    if (input.value === '') {
      this.onUpdateHeight(1);
    } else {
      this.onUpdateHeight(Number(input.value));
    }
  }

  blurHeight(e: MouseEvent) {
    const min = (e.currentTarget as any).min ? (e.currentTarget as any).min : null;
    const max = (e.currentTarget as any).max ? (e.currentTarget as any).max : null;
    if (min && this.state.height < min) {
      this.onUpdateHeight(min);
    } else if (max && this.state.height > max) {
      this.onUpdateHeight(max);
    }
  }

  onWidthInput(e: MouseEvent) {
    const input = (e.target as HTMLInputElement);
    if (input.value === '') {
      this.onUpdateWidth(1);
    } else {
      this.onUpdateWidth(Number(input.value));
    }
  }

  blurWidth(e: MouseEvent) {
    const min = (e.currentTarget as any).min ? (e.currentTarget as any).min : null;
    const max = (e.currentTarget as any).max ? (e.currentTarget as any).max : null;
    if (min && this.state.width < min) {
      this.onUpdateWidth(min);
    } else if (max && this.state.width > max) {
      this.onUpdateWidth(max);
    }
  }

  onDrag() {
    if (!this.state.dragging) {
      this.setState({dragging: true});
    }
  }

  onDragStop(rowIndex: number, colIndex: number, e: MouseEvent, position: DraggableData) {
    if (this.state.dragging) {
      this.onDragDrop(rowIndex, colIndex , e, position);
    } else {
      this.onClickCell(rowIndex, colIndex, e);
    }
    this.setState({dragging: false});
  }

  onDragDrop(rowIndex: number, colIndex: number, e: any, position: DraggableData) {
    // TODO Can't drag up or left .... UGHHHHH
    //console.log(e.path);
    if (!e.path || e.path.length == 0) return;

    const newRowIndex = e.path[0].id.split("-")[0];
    const newColIndex = e.path[0].id.split("-")[1];
    console.log(rowIndex + "," + colIndex + " --> " + newRowIndex + "," + newColIndex);
    if (rowIndex == newRowIndex && colIndex == newColIndex) return;

    const newGrid = this.props.scene.grid;
    newGrid[newRowIndex][newColIndex].sceneID = -1;
    console.log(newGrid[rowIndex][colIndex].sceneCopy);
    if (newGrid[rowIndex][colIndex].sceneCopy && newGrid[rowIndex][colIndex].sceneCopy.length > 0) {
      console.log("existing");
      newGrid[newRowIndex][newColIndex].sceneCopy = newGrid[rowIndex][colIndex].sceneCopy;
    } else {
      newGrid[newRowIndex][newColIndex].sceneCopy = [rowIndex, colIndex];
    }
    this.changeKey('grid', newGrid);
  }

  onClickCell(rowIndex: number, colIndex: number, e: MouseEvent) {
    this.setState({menuAnchorEl: e.target, isEditing: [rowIndex, colIndex], reset: null});
  }

  beginEditingName() {
    this.setState({isEditingName: this.props.scene.name});
  }

  endEditingName(e: Event) {
    e.preventDefault();
    this.changeKey('name', this.state.isEditingName);
    this.setState({isEditingName: null});
  }

  onChangeName(e: React.FormEvent<HTMLInputElement>) {
    this.setState({isEditingName:  e.currentTarget.value});
  }

  changeKey(key: string, value: any) {
    this.update((s) => s[key] = value);
  }

  update(fn: (scene: any) => void) {
    this.props.onUpdateGrid(this.props.scene, fn);
  }

  goBack() {
    this.props.goBack();
  }

  onPlayGrid() {
    this.props.onPlayGrid(this.props.scene);
  }

  getSceneName(id: string): string {
    if (id === "-1") return "~~EMPTY~~";
    const scene = this.props.allScenes.find((s) => s.id.toString() === id)
    return scene ? scene.name : "~~EMPTY~~";
  }
}

export default withStyles(styles)(GridSetup as any);