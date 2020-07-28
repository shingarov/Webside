import React, { Component } from "react";
import {
    Drawer,
    List,
    ListItemIcon,
    ListItem,
    ListItemText,
    Divider,
    IconButton
} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import PeopleIcon from '@material-ui/icons/People';
import GitHubIcon from '@material-ui/icons/GitHub';
import SettingsIcon from '@material-ui/icons/Settings';
import clsx from 'clsx';

import TranscriptIcon from '../icons/TranscriptIcon';
import ChangesBrowserIcon from '../icons/ChangesBrowserIcon';

class Sidebar extends Component {
    render() {
        return (
            <Drawer
                variant="permanent"
                classes={{paper: clsx(this.props.classes.drawerPaper, !this.props.expanded && this.props.classes.drawerPaperClose)}}
                open={this.props.expanded}>
                <div className={this.props.classes.toolbarIcon}>
                    <IconButton onClick={this.props.onClose.bind()}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <ListItem button onClick={this.props.onTranscript.bind()}>
                        <ListItemIcon>
                            <TranscriptIcon />
                        </ListItemIcon>
                        <ListItemText primary="Transcript" />
                    </ListItem>
                    <ListItem button onClick={this.props.onChanges.bind()}>
                        <ListItemIcon>
                            <ChangesBrowserIcon />
                        </ListItemIcon>
                        <ListItemText primary="Changes" />
                    </ListItem>                    
                    <ListItem button>
                        <ListItemIcon>
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary="People" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <GitHubIcon />
                        </ListItemIcon>
                        <ListItemText primary="GitHub" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <SettingsIcon />
                      </ListItemIcon>
                      <ListItemText primary="Settings" />
                    </ListItem>
                </List>
                <Divider />
            </Drawer>
            )
    }
}

export default Sidebar;