import React, { Component } from 'react';
import { Grid, Paper, Breadcrumbs, Link, Typography} from '@material-ui/core';
import clsx from 'clsx';
import { IDEContext } from '../IDEContext';
import CustomTree from '../controls/CustomTree';
import CodeEditor from '../parts/CodeEditor';

class Inspector extends Component {
    static contextType = IDEContext;
    constructor(props) {
        super(props);
        const root = this.props.root;
        if (root) {
            root.name = 'self';
            root.path = [];    
        }
        this.state = {
            root: root,
            objectTree: !root? [] : [root],
            selectedObject: !root? null : root,
        }
    }

    async componentDidMount() {
        await this.updateSlots(this.state.root);
    }

    objectPath(object) {
        let path = '';
        object.path.forEach(s => path = path + '/' + s);
        return path;
    }

    updateObject = async (object) => {
        try {
            const retrieved = await this.context.api.getSlot(this.props.root.id, this.objectPath(object));
            Object.assign(object, retrieved);
        }
        catch (error) {this.context.reportError(error)}
    }

    updateSlots = async (object) => {
        if (!object || object.slots || (!object.indexable && !object.class)) {return}
        const names = [];
        if (object.indexable) {
            for(var i = 1; i <= object.size; i++) {names.push(i.toString())}
        } else {
            try {
                const vars = await this.context.api.getInstanceVariables(object.class);
                vars.forEach(v => names.push(v.name));
            }
            catch (error) {this.context.reportError(error)}
        }
        object.slots = names.map(name => {return {name: name, path: [...object.path, name]}});
        if (!object.indexable || object.size < 20) {
            await Promise.all(object.slots.map(async slot => await this.updateObject(slot)));
        }
        this.setState({objectTree: this.state.objectTree});
    }

    selectSlot = (path) => {
        let object = this.state.root;
        path.forEach(name => object = object.slots.find(s => s.name === name));
        this.setState({selectedObject: object});
    }

    slotSelected = async (object) => {
        await this.updateObject(object);
        this.setState({selectedObject: object});
    }
    
    slotExpanded = async (object) => {
        if (!object) return;
        await Promise.all(object.slots.map(slot => this.updateSlots(slot)));
        this.setState({objectTree: this.state.objectTree});
    }

    render() {
        const {objectTree, selectedObject} = this.state;
        const {styles, showWorkspace} = this.props;
        const fixedHeightPaper = clsx(styles.paper, styles.fixedHeight);
        const path = selectedObject.path;
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} md={12} lg={12}>
                    <Breadcrumbs>
                        {path.slice(0, path.length - 1).map((s, i) => {
                            const subpath = path.slice(0, i + 1);
                            return (
                                <Link color="inherit" key={s} onClick={e => {this.selectSlot(subpath)}}>
                                    {s}
                                </Link>
                            )})
                        }
                        <Typography color="primary">{(path[path.length - 1] || "self") + " (" + selectedObject.class + ")"}</Typography>
                    </Breadcrumbs>
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <Paper className={fixedHeightPaper} variant="outlined">
                        <CustomTree
                            items={objectTree}
                            itemLabel="name"
                            id={o => this.objectPath(o)}
                            children={"slots"}
                            selectedItem={selectedObject}
                            onExpand={this.slotExpanded}
                            onSelect={this.slotSelected}/>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <CodeEditor
                        context={{object: this.props.id}}
                        styles={styles}
                        lineNumbers={false}
                        source={!selectedObject? "" : selectedObject.printString}
                        onChange={this.props.onChange}
                        onAccept={this.props.onAccept}/>
                </Grid>
                {showWorkspace && <Grid item xs={12} md={12} lg={12}>
                     <CodeEditor
                        context={{object: this.props.id}}
                        styles={styles}
                        lineNumbers={false}/>
                </Grid>}
            </Grid>
        )
    };
}

export default Inspector;