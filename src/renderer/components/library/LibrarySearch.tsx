import * as React from "react";
import clsx from "clsx";
import CreatableSelect from "react-select/creatable";

import {createStyles, Theme, withStyles} from "@material-ui/core";
import {grey} from "@material-ui/core/colors";

import LibrarySource from "../../data/LibrarySource";

const styles = (theme: Theme) => createStyles({
  searchSelect: {
    minWidth: 200,
    maxWidth: `calc(100% - ${theme.spacing(7)}px)`,
    maxHeight: theme.mixins.toolbar.minHeight,
    color: grey[900],
  },
});

class LibrarySearch extends React.Component {
  readonly props: {
    classes: any,
    displaySources: Array<LibrarySource>,
    filters: Array<string>,
    onUpdateFilters(filter: Array<string>): void,
  };

  readonly state = {
    searchInput: "",
    options: Array<{ label: string, value: string }>(),
    defaultValues: Array<{ label: string, value: string }>(),
  };

  render() {
    const classes = this.props.classes;
    return(
      <CreatableSelect
        className={clsx(classes.searchSelect, "CreatableSelect")}
        components={{DropdownIndicator: null,}}
        value={this.state.defaultValues}
        options={this.state.options}
        inputValue={this.state.searchInput}
        isClearable
        isMulti
        rightAligned={true}
        placeholder="Search ..."
        formatCreateLabel={(input: string) => "Search for " + input}
        onChange={this.handleChange}
        onInputChange={this.handleInputChange}
      />
    );
  }

  componentDidMount() {
    this.update();
  }

  componentDidUpdate(props: any) {
    if (props) {
      if (props.filters != this.props.filters || props.displaySources != this.props.displaySources) {
        this.update();
      }
    }
  }

  update() {
    const tags = new Map<string, number>();
    let untaggedCount = 0;
    let offlineCount = 0;
    let markedCount = 0;
    const options = Array<{ label: string, value: string }>();
    const defaultValues = Array<{ label: string, value: string }>();
    for (let source of this.props.displaySources) {
      if (source.offline) {
        offlineCount++;
      }
      if (source.marked) {
        markedCount++;
      }

      if (source.tags.length > 0) {
        for (let tag of source.tags) {
          if (tags.has(tag.name)) {
            tags.set(tag.name, tags.get(tag.name) + 1);
          } else {
            tags.set(tag.name, 1);
          }
        }
      } else {
        untaggedCount += 1;
      }
    }
    const tagKeys = Array.from(tags.keys()).sort((a, b) => {
      const aCount = tags.get(a);
      const bCount = tags.get(b);
      if (aCount > bCount) {
        return -1;
      } else if (aCount < bCount) {
        return 1;
      } else {
        return 0;
      }
    });
    for (let filter of this.props.filters) {
      let opt;
      if (filter.endsWith("~")) { // This is a tag filter
        opt = {label: filter.substring(0, filter.length-1) + " (Tag)", value: filter};
      } else {
        opt = {label: filter, value: filter};
      }
      options.push(opt);
      defaultValues.push(opt);
    }

    if (untaggedCount > 0 && !this.props.filters.includes("<Untagged>")) {
      options.push({label: "<Untagged> (" + untaggedCount + ")", value: "<Untagged>"});
    }
    if (offlineCount > 0 && !this.props.filters.includes("<Offline>")) {
      options.push({label: "<Offline> (" + offlineCount + ")", value: "<Offline>"});
    }
    if (markedCount > 0 && !this.props.filters.includes("<Marked>")) {
      options.push({label: "<Marked> (" + markedCount + ")", value: "<Marked>"});
    }
    for (let tag of tagKeys) {
      if (!this.props.filters.includes(tag + "~")) {
        options.push({label: tag + " (" + tags.get(tag) + ")", value: tag + "~"});
      }
    }
    if (this.state.searchInput.startsWith("-")) {
      for (let tag of tagKeys) {
        if (!this.props.filters.includes(tag + "~")) {
          options.push({label: "-" + tag + " (" + tags.get(tag) + ")", value: "-" + tag + "~"});
        }
      }
    }
    this.setState({options: options, defaultValues: defaultValues, })
  }

  handleChange = (search: [{label: string, value: string}]) => {
    if (search == null) {
      this.props.onUpdateFilters([]);
    } else {
      let filters = Array<string>();
      for (let s of search) {
        if (s.value.endsWith("~")) {
          filters = filters.concat(s.value);
        } else {
          filters = filters.concat(s.value.split(" "));
        }
      }
      this.props.onUpdateFilters(filters);
    }
  };

  handleInputChange = (searchInput: string) => {
    this.setState({searchInput})
  };
}

export default withStyles(styles)(LibrarySearch as any);