import * as React from "react";
import clsx from "clsx";
import {remote} from "electron";
const {getCurrentWindow, Menu, app} = remote;

import {
  AppBar, Container, createStyles, IconButton, Theme, Toolbar, Tooltip, Typography, withStyles
} from "@material-ui/core";

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import FullscreenIcon from '@material-ui/icons/Fullscreen';

import {createMainMenu, createMenuTemplate} from "../../../main/MainMenu";
import SceneGrid from "../../data/SceneGrid";
import Config from "../../data/Config";
import Scene from "../../data/Scene";
import Tag from "../../data/Tag";
import Player from "./Player";

const styles = (theme: Theme) => createStyles({
  root: {
    display: 'flex',
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    height: theme.spacing(8),
    marginTop: -theme.spacing(8) - 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarHover: {
    marginTop: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  hoverBar: {
    zIndex: theme.zIndex.drawer + 1,
    position: 'absolute',
    opacity: 0,
    height: theme.spacing(5),
    width: '100%',
    ... theme.mixins.toolbar,
  },
  title: {
    textAlign: 'center',
  },
  content: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: theme.palette.background.default,
  },
  container: {
    height: '100%',
    padding: theme.spacing(0),
  },
  grid: {
    flexGrow: 1,
    display: 'grid',
    height: '100%',
  },
  gridCell: {
    height: '100%',
    width: '100%',
    display: 'grid',
  },
  fill: {
    flexGrow: 1,
  },
});

class GridPlayer extends React.Component {
  readonly props: {
    classes: any,
    config: Config,
    scene: SceneGrid,
    allScenes: Array<Scene>,
    theme: Theme,
    cache(i: HTMLImageElement | HTMLVideoElement): void,
    getTags(source: string): Array<Tag>,
    goBack(): void,
    setCount(sourceURL: string, count: number, countComplete: boolean): void,
    systemMessage(message: string): void,
  };

  readonly state = {
    appBarHover: false,
    height: this.props.scene.grid && this.props.scene.grid.length > 0 &&
    this.props.scene.grid[0].length ? this.props.scene.grid.length : 1,
    width: this.props.scene.grid && this.props.scene.grid.length > 0 &&
    this.props.scene.grid[0].length > 0 ? this.props.scene.grid[0].length : 1,
  };

  _appBarTimeout: any = null;

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

    return(
      <div className={classes.root}>
        <div
          className={classes.hoverBar}
          onMouseEnter={this.onMouseEnterAppBar.bind(this)}
          onMouseLeave={this.onMouseLeaveAppBar.bind(this)}/>

        <AppBar
          position="absolute"
          onMouseEnter={this.onMouseEnterAppBar.bind(this)}
          onMouseLeave={this.onMouseLeaveAppBar.bind(this)}
          className={clsx(classes.appBar, this.state.appBarHover && classes.appBarHover)}>
          <Toolbar>
            <Tooltip title="Back" placement="right-end">
              <IconButton
                edge="start"
                color="inherit"
                aria-label="Back"
                onClick={this.props.goBack.bind(this)}>
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>

            <div className={classes.fill}/>
            <Typography component="h1" variant="h4" color="inherit" noWrap className={classes.title}>
              {this.props.scene.name}
            </Typography>
            <div className={classes.fill}/>

            <Tooltip title="Toggle Fullscreen">
              <IconButton
                edge="start"
                color="inherit"
                aria-label="FullScreen"
                onClick={this.toggleFull.bind(this)}>
                <FullscreenIcon fontSize="large"/>
              </IconButton>
            </Tooltip>
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
                    if (cell.sceneID) {
                      const scene = this.props.allScenes.find((s) => s.id == cell.sceneID);
                      return (
                        <div className={classes.gridCell} key={colIndex}>
                          {scene && (
                            <Player
                              preventSleep={rowIndex == 0 && colIndex == 0}
                              config={this.props.config}
                              scene={scene}
                              gridView
                              scenes={this.props.allScenes}
                              theme={this.props.theme}
                              tutorial={null}
                              cache={this.props.cache.bind(this)}
                              getTags={this.props.getTags.bind(this)}
                              goBack={this.props.goBack.bind(this)}
                              setCount={this.props.setCount.bind(this)}
                              systemMessage={this.props.systemMessage.bind(this)}
                            />
                          )}
                        </div>
                      );
                    } else if (cell.sceneCopy) {
                      return <div/>
                    } else {
                      return <div/>
                    }
                  })}
                </React.Fragment>
              )}
            </div>
          </Container>
        </main>
      </div>
    );
  }

  onMouseEnterAppBar() {
    clearTimeout(this._appBarTimeout);
    this.setState({appBarHover: true});
  }

  closeAppBar() {
    this.setState({appBarHover: false});
  }

  onMouseLeaveAppBar() {
    clearTimeout(this._appBarTimeout);
    this._appBarTimeout = setTimeout(this.closeAppBar.bind(this), 1000);
  }

  toggleFull() {
    this.setFullscreen(!getCurrentWindow().isFullScreen());
    this.setMenuBarVisibility(!getCurrentWindow().isFullScreen());
  }

  setAlwaysOnTop(alwaysOnTop: boolean){
    this.props.config.displaySettings.alwaysOnTop = alwaysOnTop;
    this.buildMenu();
    getCurrentWindow().setAlwaysOnTop(alwaysOnTop);
  }

  setMenuBarVisibility(showMenu: boolean) {
    this.props.config.displaySettings.showMenu = showMenu;
    this.buildMenu();
    getCurrentWindow().setMenuBarVisibility(showMenu);
  }

  setFullscreen(fullScreen: boolean) {
    this.props.config.displaySettings.fullScreen = fullScreen;
    this.buildMenu();
    getCurrentWindow().setFullScreen(fullScreen);
  }

  buildMenu() {
    createMainMenu(Menu, createMenuTemplate(app, {
      label: 'Player controls',
      submenu: Array.from(this.getKeyMap().entries()).map(([k, v]) => {
        const [label, accelerator] = v;
        return {
          label,
          accelerator,
          click: (this as any)[k as any].bind(this),
        };
      })
    }));
  }

  getKeyMap() {
    return new Map<String, Array<string>>([
      ['navigateBack', ['Go Back to Grid Setup', 'escape']],
      ['toggleFullscreen', ['Toggle Fullscreen ' + (this.props.config.displaySettings.fullScreen ? '(On)' : '(Off)'), 'Control+F']],
      ['toggleAlwaysOnTop', ['Toggle Always On Top ' + (this.props.config.displaySettings.alwaysOnTop ? '(On)' : '(Off)'), 'Control+T']],
      ['toggleMenuBarDisplay', ['Toggle Menu Bar ' + (this.props.config.displaySettings.showMenu ? '(On)' : '(Off)'), 'Control+G']],
    ]);
  }

  toggleAlwaysOnTop() {
    this.setAlwaysOnTop(!this.props.config.displaySettings.alwaysOnTop);
  }

  toggleMenuBarDisplay() {
    this.setMenuBarVisibility(!this.props.config.displaySettings.showMenu);
  }

  toggleFullscreen() {
    this.setFullscreen(!this.props.config.displaySettings.fullScreen);
  }

  navigateBack() {
    const window = getCurrentWindow();
    window.setFullScreen(false);
    window.setMenuBarVisibility(true);
    this.props.goBack();
  }
}

export default withStyles(styles)(GridPlayer as any);