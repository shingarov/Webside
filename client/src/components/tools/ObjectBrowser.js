import React, { Component } from 'react';
import { Grid, Paper } from '@material-ui/core';
import CustomTable from '../controls/CustomTable';
import Inspector from './Inspector';
import { IDEContext } from '../IDEContext';

class ObjectBrowser extends Component {
    static contextType = IDEContext;
    constructor(props) {
        super(props);
        this.state = {
            selectedObject: null,
        };
    }

    objectSelected = (object) => {
        this.setState({selectedObject: object});
    }

    unpinObject = async (object) => {
        try {
            await this.context.api.unpinObject(object.id);
        }
        catch(error) {this.context.reportError(error)}
    }

    menuOptions() {
        return [
            {label: 'Unpin', action: this.unpinObject},
        ]
    }
    
    render() {
        const selectedObject = this.state.selectedObject;
        const rows = this.props.objects;
        const columns = [
            {id: 'id', label: 'ID', align: 'left'},
            {id: 'printString', label: 'Print String', minWidth: 200, align: 'left'},
        ];
        const styles = this.props.styles;
        const ow = selectedObject? 8 : 12;
        return (
            <Grid container spacing={1}>
                <Grid item xs={ow} md={ow} lg={ow}>
                    <Paper variant="outlined">      
                        <CustomTable
                            styles={styles}
                            columns={columns}
                            rows={rows}
                            onSelect={this.objectSelected}
                            menuOptions={this.menuOptions()}/>
                    </Paper>
                </Grid>
                {selectedObject && <Grid item xs={4} md={4} lg={4}>
                    <Paper variant="outlined">
                        <Inspector
                            styles={styles}
                            root={selectedObject}
                            showWorkspace={false}/>
                        </Paper>
                </Grid>}
            </Grid>
        )
    }
}

export default ObjectBrowser;
