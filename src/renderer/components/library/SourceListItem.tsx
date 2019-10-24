import * as React from "react";
import clsx from "clsx";
import {remote} from "electron";

import {
  Badge, Checkbox, Chip, createStyles, Fab, IconButton, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText,
  SvgIcon, TextField, Theme, withStyles
} from "@material-ui/core";

import DeleteIcon from '@material-ui/icons/Delete';
import NotInterestedIcon from '@material-ui/icons/NotInterested';

import {getCachePath, getFileName, getSourceType, urlToPath} from "../../data/utils";
import {ST} from "../../data/const";
import Tag from "../../data/Tag";
import SourceIcon from "./SourceIcon";
import LibrarySource from "../../data/LibrarySource";
import Config from "../../data/Config";

const styles = (theme: Theme) => createStyles({
  root: {
    display: 'flex',
  },
  oddChild: {
    backgroundColor: (theme.palette.primary as any)["100"],
  },
  evenChild: {
    backgroundColor: (theme.palette.primary as any)["50"],
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    boxShadow: 'none',
  },
  markedSource: {
    backgroundColor: theme.palette.secondary.main,
  },
  sourceIcon: {
    color: theme.palette.primary.contrastText,
  },
  sourceMarkedIcon: {
    color: theme.palette.secondary.contrastText,
  },
  deleteButton: {
    backgroundColor: theme.palette.error.main,
  },
  deleteIcon: {
    color: theme.palette.error.contrastText,
  },
  actionButton: {
    marginLeft: theme.spacing(1),
  },
  countChip: {
    marginRight: theme.spacing(1),
  },
  urlField: {
    width: '100%',
    margin: 0,
  },
});

class SourceListItem extends React.Component {
  readonly props: {
    classes: any,
    checked: boolean,
    config: Config,
    index: number,
    isEditing: number,
    isSelect: boolean,
    source: LibrarySource,
    sources: Array<LibrarySource>,
    style: any,
    onClean(source: LibrarySource): void,
    onClearBlacklist(sourceURL: string): void,
    onClip(source: LibrarySource): void,
    onEndEdit(newURL: string): void,
    onPlay(source: LibrarySource, displaySources: Array<LibrarySource>): void,
    onRemove(source: LibrarySource): void,
    onStartEdit(id: number): void,
    onToggleSelect(): void,
    savePosition(): void,
  };

  readonly state = {
    urlInput: this.props.source.url,
  };

  render() {
    const classes = this.props.classes;

    return(
      <div style={this.props.style} className={clsx(this.props.index % 2 == 0 ? classes.evenChild : classes.oddChild)}>
        <ListItem>
          {this.props.isSelect && (
            <Checkbox value={this.props.source.url} onChange={this.props.onToggleSelect.bind(this)}
                      checked={this.props.checked}/>
          )}
          <ListItemAvatar>
            <Badge
              invisible={!this.props.source.offline}
              overlap="circle"
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              badgeContent={<NotInterestedIcon />}>
              <Fab
                size="small"
                onClick={this.onSourceIconClick.bind(this, this.props.source)}
                className={clsx(classes.avatar, this.props.source.marked && classes.markedSource)}>
                <SourceIcon url={this.props.source.url} className={clsx(classes.sourceIcon, this.props.source.marked && classes.sourceMarkedIcon)}/>
              </Fab>
            </Badge>
          </ListItemAvatar>

          <ListItemText classes={{primary: classes.root}}>
            {this.props.isEditing == this.props.source.id && (
              <form onSubmit={this.onEndEdit.bind(this)} className={classes.urlField}>
                <TextField
                  autoFocus
                  fullWidth
                  value={this.state.urlInput}
                  margin="none"
                  className={classes.urlField}
                  onBlur={this.onEndEdit.bind(this)}
                  onChange={this.onEditSource.bind(this)}/>
              </form>
            )}
            {this.props.isEditing != this.props.source.id && (
              <React.Fragment>
                <div onClick={this.onStartEdit.bind(this, this.props.source)}>
                  {this.props.source.url}
                </div>
                {this.props.source.tags && this.props.source.tags.map((tag: Tag) =>
                  <Chip
                    key={tag.id}
                    className={classes.actionButton}
                    label={tag.name}
                    color="primary"
                    size="small"
                    variant="outlined"/>
                )}
              </React.Fragment>
            )}
          </ListItemText>

          {this.props.isEditing != this.props.source.id && (
            <ListItemSecondaryAction className={classes.source}>
              {this.props.source.count > 0 && (
                <Chip
                  className={classes.countChip}
                  label={`${this.props.source.count}${this.props.source.countComplete ? '' : '+'}`}
                  color="primary"
                  size="small"/>
              )}
              {getSourceType(this.props.source.url) == ST.video && (
                <IconButton
                  onClick={this.onClip.bind(this)}
                  className={classes.actionButton}
                  edge="end"
                  size="small"
                  aria-label="clip">
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
                  </SvgIcon>
                </IconButton>
              )}
              {this.props.source.blacklist && this.props.source.blacklist.length > 0 && (
                <IconButton
                  onClick={this.props.onClearBlacklist.bind(this, this.props.source.url)}
                  className={classes.actionButton}
                  edge="end"
                  size="small"
                  aria-label="clear blacklist">
                  <SvgIcon>
                    <path d="M2 6V8H14V6H2M2 10V12H11V10H2M14.17 10.76L12.76 12.17L15.59 15L12.76 17.83L14.17
                          19.24L17 16.41L19.83 19.24L21.24 17.83L18.41 15L21.24 12.17L19.83 10.76L17 13.59L14.17
                          10.76M2 14V16H11V14H2Z" />
                  </SvgIcon>
                </IconButton>
              )}
              {this.props.config.caching.enabled && getSourceType(this.props.source.url) != ST.local &&
              (getSourceType(this.props.source.url) != ST.video || /^https?:\/\//g.exec(this.props.source.url) != null) && (
                <React.Fragment>
                  <IconButton
                    onClick={this.props.onClean.bind(this, this.props.source)}
                    className={classes.actionButton}
                    edge="end"
                    size="small"
                    aria-label="clean cache">
                    <SvgIcon>
                      <path d="M19.36 2.72L20.78 4.14L15.06 9.85C16.13 11.39 16.28 13.24 15.38 14.44L9.06
                            8.12C10.26 7.22 12.11 7.37 13.65 8.44L19.36 2.72M5.93 17.57C3.92 15.56 2.69 13.16 2.35
                            10.92L7.23 8.83L14.67 16.27L12.58 21.15C10.34 20.81 7.94 19.58 5.93 17.57Z" />
                    </SvgIcon>
                  </IconButton>
                </React.Fragment>
              )}
              <IconButton
                onClick={this.props.onRemove.bind(this, this.props.source)}
                className={clsx(classes.deleteButton, classes.actionButton)}
                edge="end"
                size="small"
                aria-label="delete">
                <DeleteIcon className={classes.deleteIcon} color="inherit"/>
              </IconButton>
            </ListItemSecondaryAction>
          )}
        </ListItem>
      </div>
    );
  }

  onSourceIconClick(source: LibrarySource, e: MouseEvent) {
    const sourceURL = source.url;
    if (e.shiftKey && !e.ctrlKey) {
      this.openExternalURL(sourceURL);
    } else if (!e.shiftKey && e.ctrlKey) {
      const fileType = getSourceType(sourceURL);
      let cachePath;
      if (fileType == ST.video) {
        cachePath = getCachePath(sourceURL, this.props.config) + getFileName(sourceURL);
      } else {
        cachePath = getCachePath(sourceURL, this.props.config);
      }
      this.openDirectory(cachePath);
    } else if (!e.shiftKey && !e.ctrlKey) {
      this.props.savePosition();
      this.props.onPlay(source, this.props.sources);
    }
  }

  onClip() {
    this.props.savePosition();
    this.props.onClip(this.props.source);
  }

  onStartEdit(s: LibrarySource) {
    this.props.onStartEdit(s.id);
  }

  onEditSource(e: MouseEvent) {
    const input = (e.target as HTMLInputElement);
    this.setState({urlInput: input.value});
  }

  onEndEdit() {
    this.props.onEndEdit(this.state.urlInput);
  }

  openDirectory(cachePath: string) {
    if (process.platform === "win32") {
      this.openExternalURL(cachePath);
    } else {
      this.openExternalURL(urlToPath(cachePath));
    }
  }

  openExternalURL(url: string) {
    remote.shell.openExternal(url);
  }
}

export default withStyles(styles)(SourceListItem as any);