import React, { Component } from 'react';
import CustomTree from '../controls/CustomTree';
import { IDEContext } from '../IDEContext';
import { withDialog } from '../dialogs';
import Scrollable from '../controls/Scrollable';

class ProjectTree extends Component {
    static contextType = IDEContext;

    createProject = async (parent) => {
        if (!parent) {return}
        const name = await this.props.dialog.prompt({title: 'Create project'});
        if (!name) {return}
        const project = await this.context.api.createProject(name, parent);
        const handler = this.props.onCreate; 
        if (handler) {handler(project)}
    }

    removeProject = async (project) => {
        if (!project) {return}
        const confirm = await this.props.dialog.confirm({
            title: 'Delete ' + project.name + '?',
            ok: {text: 'Delete', color: "secondary", variant: "outlined"}});
        if (!confirm) {return}
        await this.context.api.deleteProject(project.name);
        const handler = this.props.onRemove; 
        if (handler) {handler(project)}
    }

    renameProject = async (project) => {
        if (!project) {return}
        try {
            const newName = await this.props.dialog.prompt({title: 'Rename project', defaultValue: project.name});
            await this.context.api.renameProject(project.name, newName);
            project.name = newName;
            const handler = this.props.onRename; 
            if (handler) {handler(project)}
        }
        catch (error) {}
    }

    runTests = (project) => {
        if (project) {this.context.runTestProject(project.name)}
    }

    menuOptions() {
        return [
            {label: 'New', action: this.createProject},
            {label: 'Rename', action: this.renameProject},
            {label: 'Remove', action: this.removeProject},
            null,
            {label: 'Test', action: this.runTests},
        ]
    }

    render() {
        const roots = this.props.roots;
        return (
            <CustomTree
                items={roots? roots : []}
                itemLabel="name"
                children={"projects"}
                onExpand={this.props.onExpand}
                onSelect={this.props.onSelect}
                selectedItem={this.props.selectedProject}
                menuOptions={this.menuOptions()}/>
        )
    }
}
export default withDialog()(ProjectTree);