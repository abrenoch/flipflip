import * as React from "react";
import clsx from "clsx";
import {remote} from "electron";

import {
  Button,
  createStyles, Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link, SvgIcon,
  Theme,
  withStyles
} from "@material-ui/core";

import DeleteIcon from '@material-ui/icons/Delete';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import FolderIcon from '@material-ui/icons/Folder';
import HttpIcon from '@material-ui/icons/Http';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import MovieIcon from '@material-ui/icons/Movie';

import {DONE, LT, PT, SDGT, SDT, SGT, SPT, TF, VCT} from "../data/const";
import {Route} from "../data/Route";
import Config from "../data/Config";
import Scene from "../data/Scene";

const styles = (theme: Theme) => createStyles({
  deleteIcon: {
    color: theme.palette.error.main,
  },
  leftDialog: {
    justifyContent: 'flex-start',
  },
  rightDialog: {
    justifyContent: 'flex-end',
  },
  topDialog: {
    alignItems: 'flex-start',
  },
  bottomDialog: {
    alignItems: 'flex-end',
  },
});

class Tutorial extends React.Component {
  readonly props: {
    classes: any,
    config: Config,
    route: Route[],
    scene: Scene,
    tutorial: string,
    onDoneTutorial(lastTutorial: string): void,
    onSetTutorial(nextTutorial: string): void,
    onSkipAllTutorials(): void,
  };

  render() {
    const classes = this.props.classes;
    let left = false;
    let right = false;
    let top = false;
    let bottom = false;
    let maxWidth = "sm";

    let dialogBody = <div/>;
    if (!this.props.tutorial) return dialogBody;
    switch (this.props.tutorial) {
      case SPT.welcome:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Welcome to FlipFlip!</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                Welcome and thank you for using FlipFlip. Let's get you started!
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onSkipAll.bind(this)} color="inherit" className={classes.deleteIcon}>
                Skip ALL Tutorials
              </Button>
              <Button onClick={this.onSkip.bind(this)} color="secondary">
                Skip This Tutorial
              </Button>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case SPT.scenePicker:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Scene Picker (Home)</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                This is the home screen of FlipFlip, where you can get to your <b>Scenes</b>, your <b>Library</b>, and to <b>Settings</b>.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                <b>Click the Hamburger button to expand the sidebar</b>
              </DialogContentText>
            </DialogContent>
          </React.Fragment>;
        break;
      case SPT.drawer:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Scene Picker (Home)</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                Your Scenes are divided into 3 different tabs: <b>Scenes</b>, <b>Scene Generators</b>, and <b>Scene Grids</b>.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                From the sidebar, you can also access your Library, open another window, or access Settings.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case SPT.add1:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Scene Picker (Home)</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                Let's get started using FlipFlip by making our first scene!
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                <b>Click the Add button</b>
              </DialogContentText>
            </DialogContent>
          </React.Fragment>;
        break;
      case SPT.add2:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Scene Picker (Home)</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                Let's get started using FlipFlip by making our first scene!
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                Click the Add button
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                <b>Now click the "Add New Scene Button"</b>
              </DialogContentText>
            </DialogContent>
          </React.Fragment>;
        break;


      case SDT.welcome:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Scene Detail</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                You've started your first Scene! A Scene is the main component of FlipFlip, where you can specify all your effects and options.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onSkip.bind(this)} color="secondary">
                Skip Tutorial
              </Button>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case SDT.title:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Scene Detail</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                Each Scene has a name, this is what will appear back on the Scene Picker.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                <b>You can edit a Scene's name by clicking it</b>, but we'll leave it as "Cute Stuff" for now.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case SDT.add1:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Sources</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                The most important part of any Scene is its <b>sources</b>. This is a list of places (local or remote) FlipFlip will pull from.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                To add our first source <b>Click the add button</b>.
              </DialogContentText>
            </DialogContent>
          </React.Fragment>;
        break;
      case SDT.add2:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Sources</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                From here, we can:
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                <LocalLibraryIcon /> Import Sources from the Library
                <br/>
                <MovieIcon /> Add Local Videos/Playlists
                <br/>
                <FolderIcon /> Add Local Directories
                <br/>
                <HttpIcon /> Add Individual URLs
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                For this tutorial, we'll add a single URL. <b>Click the URL button</b>
              </DialogContentText>
            </DialogContent>
          </React.Fragment>;
        break;
      case SDT.source:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Sources</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                Great! Usually, you'd enter the URL for your source, but we've gone ahead and added it for you this time.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                Actions have been disabled for this tutorial, but <b>let's look at each part of the source...</b>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case SDT.sourceAvatar:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Source</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                Next to each source is its <b>Avatar</b>. This will display the <b>type of source</b> (Imgur in this case) and you
                can <b>click it</b> to do the following:
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                Click: <b>Tag this Source</b> (this only works for sources in your Library)
                <br/>
                Shift+Click: <b>Externally opens url/directory</b>
                <br/>
                Ctrl+Click: <b>Opens caching directory</b>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case SDT.sourceTitle:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Source</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                This is the <b>URL</b> of the source. <b>You can edit the URL by clicking it</b>.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case SDT.sourceTags:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Source</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                These are the source's <b>Tags</b>. <b>You can add/remove tags and tag sources in the Library</b>.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case SDT.sourceCount:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Source</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                This is the source's <b>Count</b>. Each source remebers the number of images/videos available. When a <b>+</b> is next to the number, that means the count is incomplete, and there may be more images/videos.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case SDT.sourceButtons:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Source</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                At the end of each source are some <b>Actions</b>. These will only appear for relevant sources:
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                <SvgIcon>
                  <path d="M11 21H7V19H11V21M15.5 19H17V21H13V19H13.2L11.8 12.9L9.3 13.5C9.2 14 9 14.4 8.8
                          14.8C7.9 16.3 6 16.7 4.5 15.8C3 14.9 2.6 13 3.5 11.5C4.4 10 6.3 9.6 7.8 10.5C8.2 10.7 8.5
                          11.1 8.7 11.4L11.2 10.8L10.6 8.3C10.2 8.2 9.8 8 9.4 7.8C8 6.9 7.5 5 8.4 3.5C9.3 2 11.2
                          1.6 12.7 2.5C14.2 3.4 14.6 5.3 13.7 6.8C13.5 7.2 13.1 7.5 12.8 7.7L15.5 19M7 11.8C6.3
                          11.3 5.3 11.6 4.8 12.3C4.3 13 4.6 14 5.3 14.4C6 14.9 7 14.7 7.5 13.9C7.9 13.2 7.7 12.2 7
                          11.8M12.4 6C12.9 5.3 12.6 4.3 11.9 3.8C11.2 3.3 10.2 3.6 9.7 4.3C9.3 5 9.5 6 10.3 6.5C11
                          6.9 12 6.7 12.4 6M12.8 11.3C12.6 11.2 12.4 11.2 12.3 11.4C12.2 11.6 12.2 11.8 12.4
                          11.9C12.6 12 12.8 12 12.9 11.8C13.1 11.6 13 11.4 12.8 11.3M21 8.5L14.5 10L15 12.2L22.5
                          10.4L23 9.7L21 8.5M23 19H19V21H23V19M5 19H1V21H5V19Z" />
                </SvgIcon> Clip Video (Displays for video sources)
                <br/>
                <SvgIcon>
                  <path d="M2 6V8H14V6H2M2 10V12H11V10H2M14.17 10.76L12.76 12.17L15.59 15L12.76 17.83L14.17
                          19.24L17 16.41L19.83 19.24L21.24 17.83L18.41 15L21.24 12.17L19.83 10.76L17 13.59L14.17
                          10.76M2 14V16H11V14H2Z" />
                </SvgIcon> Clear Blacklist (Displays for sources that have a blacklist)
                <br/>
                <SvgIcon>
                  <path d="M19.36 2.72L20.78 4.14L15.06 9.85C16.13 11.39 16.28 13.24 15.38 14.44L9.06
                            8.12C10.26 7.22 12.11 7.37 13.65 8.44L19.36 2.72M5.93 17.57C3.92 15.56 2.69 13.16 2.35
                            10.92L7.23 8.83L14.67 16.27L12.58 21.15C10.34 20.81 7.94 19.58 5.93 17.57Z" />
                </SvgIcon> Clean Cache (Displays while caching is enabled)
                <br/>
                <DeleteIcon className={classes.deleteIcon} color="inherit"/> Delete Source
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case SDT.options1:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Scene Detail</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                Now that we have a source to play from, let's choose some options for our scene.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                The Scene Detail page has 4 tabs: <b>Options</b>, <b>Effects</b>, <b>Audio/Text</b>, and <b>Sources</b>
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                <b>Click the OPTIONS tab</b>
              </DialogContentText>
            </DialogContent>
          </React.Fragment>;
        break;
      case SDT.options2:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Options</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                This is the options tab. Here you can customize things like <b>scene timing</b> and <b>image filters</b>,
                as well as setting up <b>next scenes</b> and <b>overlays</b>.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case SDT.optionsLeft:
        right = true;
        bottom = true;
        maxWidth = "xs";
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Options</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                On the first card ..
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case SDT.timing:
        right = true;
        bottom = true;
        maxWidth = "xs";
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Scene Timing</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                You can control <b>how rapidly images should change</b>. It could be at a <b>constant</b> rate, <b>randomly</b>, in a <b>wave</b>, or even to the <b>bpm</b> of an audio track!
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                <i>Let's keep it here: changing <b>constantly, every 1 second</b></i>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case SDT.imageSizing:
        right = true;
        bottom = true;
        maxWidth = "xs";
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Image/Background</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                You can choose <b>how to size the images</b> and <b>what background to use</b>.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case SDT.nextScene:
        right = true;
        bottom = true;
        maxWidth = "xs";
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Next Scene</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                You can <b>link scenes together</b>! Just choose the <b>next scene</b> to play and <b>how many <u>seconds</u></b> it should start after.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                <i>We'll leave this disabled for this tutorial</i>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case SDT.overlays:
        right = true;
        bottom = true;
        maxWidth = "xs";
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Overlays</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                You can <b>overlay scenes</b> on top of this one! Just <b>add a scene</b> to overlay and choose its <b>opacity</b>.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                While FlipFlip doesn't impose any direct limit on the number of overlays, please be aware that <b>additional overlays will negatively impact performance</b>.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                <i>We'll leave this disabled for this tutorial</i>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case SDT.optionsRight:
        left = true;
        top = true;
        maxWidth = "xs";
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Options</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                On the second card ..
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case SDT.imageOptions:
        left = true;
        top = true;
        maxWidth = "xs";
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Image Options</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                You can <b>filter images</b> to just <b>videos</b>, <b>animated</b>, or <b>stills</b>.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                You can also <b>control how long GIFs will play</b> for. This takes priority over scene timing.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                <i>We'll keep it allowing <b>All Images</b></i>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case SDT.videoOptions:
        left = true;
        top = true;
        maxWidth = "xs";
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Video Options</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                You can <b>control how long videos will play</b> for and <b>at what speed</b>. You can also choose to
                <b>start videos at a random timestamp</b> and/or to <b>have videos continue</b> (rather than restart
                each time they appear). You can also choose to <b>rotate portrait videos</b> so they appear in
                landsacpe orientation.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                Lastly, you can <b>choose to use Clips or not</b>. Clips can only be created for individual videos and
                must be manually created in the <b>Video Clipper</b>. If no clips are present, the whole video will be used.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                If clips are disabled, you can choose to <b>skip the first and last parts</b> of all videos (to help skipping intro/credits)
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case SDT.weighting:
        left = true;
        top = true;
        maxWidth = "xs";
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Weighing</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                ... choose how to weigh our images. We can either <b>weigh by source</b> or <b>weigh by image</b>.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                <b>Weighing by Source</b> means that each <i>source</i> will be treated equally, regardless of how many images it has.
                <br/>
                <i>Sources with a low number of images may cause undesirable repeats.</i>
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                <b>Weighing by Image</b> means that each <i>image</i> will be treated equally, regardless of its source.
                <br/>
                <i>Sources with a high number of images may overwhelm other sources.</i>
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                <i>Since we only have 1 source, it <b>doesn't matter</b></i>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case SDT.ordering:
        left = true;
        top = true;
        maxWidth = "xs";
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Ordering</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                You can choose how to order our images. Typically, it's best to use <b>random</b>, but you may want to <b>order</b> or even <b>strictly order</b> your sources.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                Typically, FlipFlip will show images in the order they load. However, <b>strictly ordered</b> will force
                FlipFlip to wait for the next image to be ready before displaying.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                <i>We'll keep it ordered <b>randomly</b></i>.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case SDT.effects1:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Scene Detail</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                Based on our options, we are using <b>all images</b> and they will <b>change every 1 second</b>.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                Now, let's add some effects! <b>Click the EFFECTS Tab</b>
              </DialogContentText>
            </DialogContent>
          </React.Fragment>;
        break;
      case SDT.effects2:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Effects</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                This is the effects tab. Here you can toggle and customize effects: <b>zoom/move</b>, <b>cross fade</b> and <b>strobe</b>.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                <i><b>Audio tracks</b> and <b>text overlays</b> are located in the Audio/Text tab.</i>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case SDT.zoom1:
        right = true;
        bottom = true;
        maxWidth = "xs";
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Effects</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                Let's add some effects to our scene. <b>First, enable Zoom</b>.
              </DialogContentText>
            </DialogContent>
          </React.Fragment>;
        break;
      case SDT.zoom2:
        right = true;
        bottom = true;
        maxWidth = "xs";
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Zoom</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                We just want a mild zoom.
                <br/>
                So <b>set Zoom Start to <u>0.8</u></b> and <b>set Zoom End to <u>1.2</u></b>
              </DialogContentText>
            </DialogContent>
          </React.Fragment>;
        break;
      case SDT.zoom3:
        right = true;
        bottom = true;
        maxWidth = "xs";
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Zoom</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                Great! Now let's change the zoom timing to be <b>Wave</b>.
              </DialogContentText>
            </DialogContent>
          </React.Fragment>;
        break;
      case SDT.zoom4:
        right = true;
        bottom = true;
        maxWidth = "xs";
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Zoom</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                Since our scene is changing every second, we'll leave the <b>wave between <u>1000 ms</u> and <u>2000 ms</u></b>.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case SDT.fade1:
        left = true;
        top = true;
        maxWidth = "xs";
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Fade</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                Great! Now, let's <b>enable Cross-Fade</b>
              </DialogContentText>
            </DialogContent>
          </React.Fragment>;
        break;
      case SDT.fade2:
        left = true;
        top = true;
        maxWidth = "xs";
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Fade</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                We'll leave this <b>fading at <u>500 ms</u></b>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case SDT.play:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Scene Detail</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                Finally, our scene is ready to play!
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                <b>Press the Play button to begin</b>
              </DialogContentText>
            </DialogContent>
          </React.Fragment>;
        break;


      case PT.welcome:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Player</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                Welcome to your first Scene! Here your Scene will play out according to your configuration.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onSkip.bind(this)} color="secondary">
                Skip Tutorial
              </Button>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case PT.toolbar:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Player</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                Up at the top is the <b>toolbar</b>. Here you can <b>control the Scene playback</b> or <b>return to Scene Detail</b>.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case PT.sidebar:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Player</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                To the left is a <b>sidebar</b> with <b>options and effects from Scene Detail</b>.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                <i><b>To improve performance</b>, each section is compressed until needed.</i>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case PT.tagging:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Player</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                While <b>Tagging a source</b> in your <b>Library</b>, the set of tags will appear when you hover near the bottom.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                <ArrowDownwardIcon/> <i>Since we're not tagging, <b>there's nothing there</b>.</i> <ArrowDownwardIcon/>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case PT.final:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Player</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                Well that about covers all the basics! You've learned how to <b>add a Scene</b>, <b>configure it</b>, and <b>begin playback</b>!
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                Be sure to check out the <Link href="#" onClick={this.openLink.bind(this, "https://ififfy.github.io/flipflip/#")}>FlipFlip docs</Link> if you need any help.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                <b>Enjoy FlipFlip!</b>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Back to Player
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;


      case LT.welcome:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Library</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                This is your <b>Library</b>. Here you can <b>organize</b> all your different sources and use them <b>with your Scenes</b>.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onSkip.bind(this)} color="secondary">
                Skip Tutorial
              </Button>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case LT.library:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Library</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                The real power of the <b>Library</b> is the <b>Tagging</b> system. You can <b>Tag</b> sources
                by <b>clicking the Avatar</b> next to it, or you can activate <b>batch tagging</b> in the sidebar.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                After you've tagged a few sources, you can create a <b>Scene Generator</b>. This is a special kind of
                Scene which uses <b>tag based <u>rules</u></b> to randomly generate a set of sources.
                <br/>
                <i>e.g. A scene with 50% <b>cats</b> and 50% <b>llamas</b>.</i>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case LT.toolbar:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Library</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                Use the <b>search bar</b> in the top right to <b>filter the sources</b> you are viewing. This can also
                be very helpful when <b>tagging</b> and <b>importing</b> sources.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case LT.sidebar1:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Library</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                The sidebar has some other helpful tools.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                <b>Click the Hamburger button to expand the sidebar</b>
              </DialogContentText>
            </DialogContent>
          </React.Fragment>;
        break;
      case LT.sidebar2:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Library</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                From here we can <b>manage tags</b>, <b>batch tag sources</b>, <b>import remote sources</b>, and <b>mark offline sources</b>.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                <b>Remote source imports</b> (<i>Tumblr</i>, <i>Reddit</i>, <i>Twitter</i>, <i>Instagram</i>) will appear after you have logged into the relevant service in <b>Settings</b>.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                While any of these processes are running, you will see a <b>progress bar</b>. Feel free to <b>continue using FlipFlip</b>. You will be <b>alerted</b> when the job is finished.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case LT.final:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Library</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                That's about it for the <b>Library</b>.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                You can easily get your Library started by adding <b>local directories</b> or <b>videos</b>.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                Alternatively, you can head to <b>Settings</b> (from the home page) and activate
                <i>Tumblr</i>, <i>Reddit</i>, <i>Twitter</i>, and/or <i>Instagram</i> and then come back here to <b>import your sources</b>.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                After you've <b>added a few tags</b>, you can <b>tag Sources by clicking their Avatar</b>.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Back to Library
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;


      case SDGT.welcome:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Scene Generator</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                You've made your first <b>Scene Generator</b>!
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                Here, you can use your <b>tagged sources</b> to generate <b>random scenes</b>.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onSkip.bind(this)} color="secondary">
                Skip Tutorial
              </Button>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case SDGT.buttons:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Scene Generator</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                In the bottom right, you can change the <b>max number of sources</b> to generate and <b>make new rules</b>.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                In order to <b>generate a scene</b>, your rules need to <b>add up to <u>100%</u></b>. You'll see
                the <b>remaining percent</b> above the <b>Generate button</b>
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                To begin, <b>make a Simple Rule</b>
              </DialogContentText>
            </DialogContent>
          </React.Fragment>;
        break;
      case SDGT.edit1:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Simple Rule</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                To edit a rule, <b>click its Icon</b>
              </DialogContentText>
            </DialogContent>
          </React.Fragment>;
        break;
      case SDGT.edit2:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Simple Rule</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                Each Simple Rule has 3 options:
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                <b>Percent</b>: This tag should make up N% of the sources
                <br/>
                <b>Require</b>: All sources need this tag
                <br/>
                <b>Exclude</b>: No source can have this tag
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                <b>Set this Rule to <u>Require</u></b>
              </DialogContentText>
            </DialogContent>
          </React.Fragment>;
        break;
      case SDGT.generate:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Scene Generator</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                Great! Now <b>every source</b> in this Generator will <b>require this tag</b>.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                <b>Click the Generate Button!</b>
              </DialogContentText>
            </DialogContent>
          </React.Fragment>;
        break;
      case SDGT.final:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Scene Generator</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                <b>And that's it!</b> That's all you need to <b>generate scenes</b>.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                The more <b>tagged scenes</b> you have in your <b>Library</b>, the better generators will work. If you
                need to <b>combine</b> tag rules, you can make an <b>Advanced Rule</b>.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Back to Scene Detail
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case SDGT.finalError:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Scene Generator (Error)</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                <b>Whoops!</b> Looks like you <b>don't have any sources</b> with that <b>tag</b>...You'll need to <b>tag some sources</b> for generators to work.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                In any case, <b>that's it!</b> That's all you need to <b>generate scenes</b>.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                The more <b>tagged scenes</b> you have in your <b>Library</b>, the better generators will work. If you
                need to <b>combine</b> tag rules, you can make an <b>Advanced Rule</b>.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Back to Scene Detail
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;


      case SGT.welcome:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Scene Grid</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                Welcome to your your first <b>Scene Grid</b>!
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                Here, you can play your <b>Scenes</b> simultaneously in a <b>grid format</b>.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onSkip.bind(this)} color="secondary">
                Skip Tutorial
              </Button>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case SGT.dimensions:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Scene Grid</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                You can change the <b>dimensions of the grid in the top right</b>.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                <b>Make this grid <u>2x2</u></b>
              </DialogContentText>
            </DialogContent>
          </React.Fragment>;
        break;
      case SGT.cells:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Scene Grid</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                Now you have a <b>grid</b> of <b>4 Scenes</b>!
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                To change a grid cell, <b>click the cell</b> and <b>select a Scene</b>. You can also keep the cell <b>EMPTY</b> if you want.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                <i>For the purpose of this tutorial, we've <b>filled the grid</b> already</i>.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case SGT.final:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Scene Grid</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                That's all there is to <b>Scene Grids</b>. You're ready to play the grid!
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                Please be aware that <b>typical Scene controls and configs</b> are <b><u>not</u> available</b> in the Scene Grid player.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Back to Scene Grid
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;


      case VCT.welcome:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Video Clipper</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                Welcome to the <b>Video Clipper</b>
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                Here, you can <b>select parts of a video</b> to use <b>during playback</b>.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onSkip.bind(this)} color="secondary">
                Skip Tutorial
              </Button>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case VCT.controls:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Video Clipper</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                At the <b>bottom of the screen</b> are the typical <b>video controls</b>.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                You can <b>seek</b> through the video, <b>play/pause</b>, and change the <b>volume</b>. You
                will also see the <b>start time</b> of the clips you make <b>show up</b> on the seek bar.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Continue
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
      case VCT.clips:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Video Clipper</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                Above the video controls are your <b>Clips</b>. You can <b>edit</b> a clip by <b>clicking its button</b>.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                To make a new Clip <b>Click the +</b>
              </DialogContentText>
            </DialogContent>
          </React.Fragment>;
        break;
      case VCT.clip:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Video Clipper</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                Now, you can <b>slide the start and end</b> to the desired points (or <b>enter the timestamp </b>in the text field).
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                The <b>main video controls</b> will let you preview your clip.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                When you are done be sure to <b>Click the Save button</b>.
              </DialogContentText>
            </DialogContent>
          </React.Fragment>;
        break;
      case VCT.final:
        dialogBody =
          <React.Fragment>
            <DialogTitle id="tutorial-title">Video Clipper</DialogTitle>
            <DialogContent>
              <DialogContentText id="tutorial-description">
                That's all there is to <b>making clips</b>.
              </DialogContentText>
              <DialogContentText id="tutorial-description">
                <i>Be sure to enable <b>Use Clips</b> in your <b>Scenes</b> if you want to use your <b>clips</b></i>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onContinue.bind(this)} color="primary">
                Back to Video Clipper
              </Button>
            </DialogActions>
          </React.Fragment>;
        break;
    }

    return(
      <Dialog
        maxWidth={maxWidth as any}
        open={!!this.props.tutorial}
        classes={{container: clsx(left && classes.leftDialog, right && classes.rightDialog, top && classes.topDialog, bottom && classes.bottomDialog)}}
        aria-labelledby="tutorial-title"
        aria-describedby="tutorial-description">
        {dialogBody}
      </Dialog>
    );
  }

  componentDidMount() {
    this.showNextTutorial();
  }

  componentDidUpdate() {
    this.showNextTutorial();
  }

  setTutorial(tutorial: string) {
    if (this.props.tutorial != tutorial) {
      this.props.onSetTutorial(tutorial);
    }
  }

  showNextTutorial() {
    switch (this.getRoute()) {
      case "picker":
        switch (this.props.config.tutorials.scenePicker) {
          case SPT.welcome:
            this.setTutorial(SPT.scenePicker);
            return;
          case SPT.scenePicker:
            this.setTutorial(SPT.drawer);
            return;
          case SPT.drawer:
            this.setTutorial(SPT.add1);
            return;
          case SPT.add1:
            this.setTutorial(SPT.add2);
            return;
          case SPT.add2:
          case SPT.done:
            // We're done, don't show
            this.setTutorial(null);
            return;
          default:
            this.setTutorial(SPT.welcome);
            return;
        }
      case "scene":
        if (this.props.scene.generatorWeights == null) {
          switch (this.props.config.tutorials.sceneDetail) {
            case SDT.welcome:
              this.setTutorial(SDT.title);
              return;
            case SDT.title:
              this.setTutorial(SDT.add1);
              return;
            case SDT.add1:
              this.setTutorial(SDT.add2);
              return;
            case SDT.add2:
              this.setTutorial(SDT.source);
              return;
            case SDT.source:
              this.setTutorial(SDT.sourceAvatar);
              return;
            case SDT.sourceAvatar:
              this.setTutorial(SDT.sourceTitle);
              return;
            case SDT.sourceTitle:
              this.setTutorial(SDT.sourceTags);
              return;
            case SDT.sourceTags:
              this.setTutorial(SDT.sourceCount);
              return;
            case SDT.sourceCount:
              this.setTutorial(SDT.sourceButtons);
              return;
            case SDT.sourceButtons:
              this.setTutorial(SDT.options1);
              return;
            case SDT.options1:
              this.setTutorial(SDT.options2);
              return;
            case SDT.options2:
              this.setTutorial(SDT.optionsLeft);
              return;
            case SDT.optionsLeft:
              this.setTutorial(SDT.timing);
              return;
            case SDT.timing:
              this.setTutorial(SDT.imageSizing);
              return;
            case SDT.imageSizing:
              this.setTutorial(SDT.nextScene);
              return;
            case SDT.nextScene:
              this.setTutorial(SDT.overlays);
              return;
            case SDT.overlays:
              this.setTutorial(SDT.optionsRight);
              return;
            case SDT.optionsRight:
              this.setTutorial(SDT.imageOptions);
              return;
            case SDT.imageOptions:
              this.setTutorial(SDT.videoOptions);
              return;
            case SDT.videoOptions:
              this.setTutorial(SDT.weighting);
              return;
            case SDT.weighting:
              this.setTutorial(SDT.ordering);
              return;
            case SDT.ordering:
              this.setTutorial(SDT.effects1);
              return;
            case SDT.effects1:
              this.setTutorial(SDT.effects2);
              return;
            case SDT.effects2:
              if (this.props.scene.zoom == true) {
                this.props.onDoneTutorial(SDT.zoom1);
              } else {
                this.setTutorial(SDT.zoom1);
              }
              return;
            case SDT.zoom1:
              if (this.props.scene.zoomStart == 0.8 && this.props.scene.zoomEnd == 1.2) {
                this.props.onDoneTutorial(SDT.zoom2);
              } else {
                this.setTutorial(SDT.zoom2);
              }
              return;
            case SDT.zoom2:
              if (this.props.scene.transTF == TF.sin) {
                this.props.onDoneTutorial(SDT.zoom3);
              } else {
                this.setTutorial(SDT.zoom3);
              }
              return;
            case SDT.zoom3:
              this.setTutorial(SDT.zoom4);
              return;
            case SDT.zoom4:
              if (this.props.scene.crossFade) {
                this.props.onDoneTutorial(SDT.fade1);
              } else {
                this.setTutorial(SDT.fade1);
              }
              return;
            case SDT.fade1:
              this.setTutorial(SDT.fade2);
              return;
            case SDT.fade2:
              this.setTutorial(SDT.play);
              return;
            case SDT.play:
            case SDT.done:
              // We're done, don't show
              this.setTutorial(null);
              return;
          }
        } else {
          switch (this.props.config.tutorials.sceneGenerator) {
            case SDGT.welcome:
              this.setTutorial(SDGT.buttons);
              return;
            case SDGT.buttons:
              this.setTutorial(SDGT.edit1);
              return;
            case SDGT.edit1:
              this.setTutorial(SDGT.edit2);
              return;
            case SDGT.edit2:
              this.setTutorial(SDGT.generate);
              return;
            case SDGT.generate:
              this.setTutorial(SDGT.final);
              return;
            case SDGT.generateError:
              this.setTutorial(SDGT.finalError);
              return;
            case SDGT.final:
            case SDGT.finalError:
            case SDGT.done:
              // We're done, don't show
              this.setTutorial(null);
              return;
            default:
              return;
          }
        }
        return;
      case "play":
        switch (this.props.config.tutorials.player) {
          case PT.welcome:
            this.setTutorial(PT.toolbar);
            return;
          case PT.toolbar:
            this.setTutorial(PT.sidebar);
            return;
          case PT.sidebar:
            this.setTutorial(PT.tagging);
            return;
          case PT.tagging:
            this.setTutorial(PT.final);
            return;
          case PT.final:
          case PT.done:
            // We're done, don't show
            this.setTutorial(null);
            return;
          default:
            return;
        }
      case "library":
        switch (this.props.config.tutorials.library) {
          case LT.welcome:
            this.setTutorial(LT.library);
            return;
          case LT.library:
            this.setTutorial(LT.toolbar);
            return;
          case LT.toolbar:
            this.setTutorial(LT.sidebar1);
            return;
          case LT.sidebar1:
            this.setTutorial(LT.sidebar2);
            return;
          case LT.sidebar2:
            this.setTutorial(LT.final);
            return;
          case LT.final:
          case LT.done:
            // We're done, don't show
            this.setTutorial(null);
            return;
          default:
            return;
        }
      case "grid":
        switch (this.props.config.tutorials.sceneGrid) {
          case SGT.welcome:
            this.setTutorial(SGT.dimensions);
            return;
          case SGT.dimensions:
            this.setTutorial(SGT.cells);
            return;
          case SGT.cells:
            this.setTutorial(SGT.final);
            return;
          case SGT.final:
          case SGT.done:
            // We're done, don't show
            this.setTutorial(null);
            return;
          default:
            return;
        }
      case "clip":
        switch (this.props.config.tutorials.videoClipper) {
          case VCT.welcome:
            this.setTutorial(VCT.controls);
            return;
          case VCT.controls:
            this.setTutorial(VCT.clips);
            return;
          case VCT.clips:
            this.setTutorial(VCT.clip);
            return;
          case VCT.clip:
            this.setTutorial(VCT.final);
            return;
          case VCT.final:
          case VCT.done:
            // We're done, don't show
            this.setTutorial(null);
            return;
          default:
            return;
        }
    }
  }

  onSkipAll() {
    this.props.onSkipAllTutorials();
  }

  onSkip() {
    this.props.onDoneTutorial(DONE);
  }

  onContinue() {
    this.props.onDoneTutorial(this.props.tutorial);
  }

  getRoute() {
    if (this.props.route.length < 1) return "picker";
    return this.props.route[this.props.route.length - 1].kind;
  }

  openLink(url: string) {
    remote.shell.openExternal(url);
  }
}

export default withStyles(styles)(Tutorial as any);