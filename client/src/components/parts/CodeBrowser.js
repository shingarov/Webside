import React, { Component } from 'react';
import { Grid, Paper, Link } from '@material-ui/core';
import { ToggleButton , ToggleButtonGroup } from '@material-ui/lab';
import { IDEContext } from '../IDEContext';
import CodeEditor from './CodeEditor';
import { withDialog } from '../dialogs/index';

class CodeBrowser extends Component {
    static contextType = IDEContext;

    constructor(props) {
        super(props);
        this.state = {
            method: null,
            selectedMode: 'source',
        }
    }

    static getDerivedStateFromProps(props, state) {
        const mode = !props.method && state.selectedMode === 'source'? 
            'definition' : props.method !== state.method? 'source' : state.selectedMode;
        if (props.method === state.method && mode === state.selectedMode) {return null}
        return {
            selectedMode: mode,
            method: props.method,
        }
    }

    defineClass = async (definition) => {
        if (!this.props.class) {return}
        const classname = this.props.class? this.props.class.name : null;
        try {
            await this.context.api.defineClass(classname, definition);
            const species = await this.context.api.getClass(classname);
            const handler = this.props.onClassDefined;
            if (handler) {handler(species)}
        }
        catch (error) {this.context.reportError(error)}
    }

    renameClass = async (target) => {
        if (target !== this.props.class.name && target !== this.props.class.superclass) {
            return}
        try {
            const newName = await this.props.dialog.prompt({title: 'Rename class', defaultValue: target, required: true});
            await this.context.api.renameClass(target, newName);
            this.props.class.name = newName;
            const handler = this.props.onRenameClass;
            if (handler) {handler(this.props.class)}
        }
        catch (error) {this.context.reportError(error)}
    }

    commentClass = async (comment) => {
        if (!this.props.class) {return}
        try {
            await this.context.api.commentClass(this.props.class.name, comment);
            const species = await this.context.api.getClass(this.props.class.name);
            const handler = this.props.onClassCommented;
            if (handler) {handler(species)}
        }
        catch (error) {this.context.reportError(error)}
    }

    compileMethod = async (source) => {
        if (!this.props.class) {return}
        try {
            const category = this.props.method? this.props.method.category : null;
            const change = await this.context.api.compileMethod(this.props.class.name, category, source);
            const method = await this.context.api.getMethod(this.props.class.name, change.selector);
            const handler = this.props.onMethodCompiled;
            if (handler) {handler(method)}
        }
        catch (error) {
            this.handlerCompilationError(error, source)
        }
    }

    async handlerCompilationError(error, source) {
        const method = this.props.method;
        method.source = source;
        const data = error.data;
        if (data && data.suggestion && data.changes) {
            const retry  = await this.props.dialog.confirm(data.suggestion + '?');
            if (retry) {
                try {
                    let method;
                    for (const change of data.changes) {
                        const applied = await this.context.api.postChange(change);
                        method = await this.context.api.getMethod(this.props.class.name, applied.selector);
                    }
                    const handler = this.props.onMethodCompiled;
                    if (handler) {handler(method)}
                }
                catch (error) {
                    this.handlerCompilationError(error, data.changes[data.changes.length - 1].sourceCode)
                }
            }
        } else {
            if (data && data.interval) {
                method.lintAnnotations = [{
                    from: data.interval.start,
                    to: data.interval.end,
                    severity: 'error',
                    description: data.description}]
                }
            this.setState({method: method});
        }
    }

    currentSource = () => {
        const species = this.props.class;
        const method = this.props.method;
        const mode = this.state.selectedMode;
        let source;
        switch (mode) {
            case 'comment':
                source = !species? '' : species.comment;
                break;
            case 'definition':
                source = !species? '' : species.definition;
                break;
            case 'source':
                source = !method? '' : method.source;
                break;
            default:
        }
        return source;
    }

    currentAuthor = () => {
        if (this.state.selectedMode === 'source') {
            const method = this.props.method;
            return method? method.author : '';
        }
        return ''
    }

    currentTimestamp = () => {
        const method = this.props.method;
        if (this.state.selectedMode === 'source' && method && method.timestamp && method.timestamp !== '') {
            return new Date(method.timestamp).toLocaleString();
        }
        return ''
    }

    currentProject = () => {
        const species = this.props.class;
        const method = this.props.method;
        if (this.state.selectedMode === 'source' && method) {
            return method.project;
        }
        if (species) {
            return species.project;
        }
        return ''
    }

    currentLintAnnotations = () => {
        if (this.state.selectedMode === 'source') {
            const method = this.props.method; 
            return method? method.lintAnnotations : [];
        }
        return ''
    }

    modeChanged = (event, mode) => {
        this.setState({selectedMode: mode})
    }

    acceptClicked = (source) => {
        switch (this.state.selectedMode) {
            case 'comment':
                this.commentClass(source);
                break;
            case 'definition':
                this.defineClass(source);
                break;
            case 'source':
                this.compileMethod(source);
                break;
            default:
        }
    }

    render() {
        const mode = this.state.selectedMode;
        const author = this.currentAuthor();
        const timestamp = this.currentTimestamp();
        const project = this.currentProject();
        const {selectedInterval, selectedWord} = this.props;
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} md={12} lg={12}>
                    <ToggleButtonGroup
                        label='primary'
                        value={mode}
                        exclusive
                        onChange={this.modeChanged}>
                        <ToggleButton value='source' variant='outlined' size='small'>
                            Method defintion
                        </ToggleButton>
                        <ToggleButton value='definition' variant='outlined' size='small'>
                            Class definition
                        </ToggleButton>
                        <ToggleButton value='comment' variant='outlined' size='small'>
                            Class comment
                        </ToggleButton>
                    </ToggleButtonGroup>    
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                    <Paper variant="outlined">
                        <CodeEditor
                            context={this.props.context}
                            styles={this.props.styles}
                            lineNumbers={true}
                            source={this.currentSource()}
                            mode={(mode === 'comment') ? 'text' : 'smalltalk'}
                            lintAnnotations={this.currentLintAnnotations()}
                            selectedRanges={!selectedInterval? [] : [selectedInterval]}
                            selectedWord={selectedWord}
                            showAccept
                            onAccept={this.acceptClicked}
                            onRename={target => this.renameClass(target)}/>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                    {timestamp? 'Modified on ' : ''}
                    {timestamp}
                    {author? ' by ' : ''} 
                    {author &&
                        <Link href="#" onClick={() => this.context.openChat(author)}>
                            {author}
                        </Link>}
                    {timestamp || author? ' - ' : ''} 
                    {project && 
                        <Link href="#" onClick={() => this.context.browseProject(project)}>
                            {project}
                        </Link>}
                </Grid>
            </Grid>
        )
    }
}

export default withDialog()(CodeBrowser);