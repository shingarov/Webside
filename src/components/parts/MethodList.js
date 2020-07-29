import React, { Component } from 'react';
import CustomList from '../controls/CustomList';
import { ArrowUpDownBold, ArrowUpBold, ArrowDownBold } from 'mdi-material-ui';
import { AppContext } from '../../AppContext';

class MethodList extends Component {
    static contextType = AppContext;

    removeMethod = async (method) => {
        await this.context.api.deleteMethod(method.class, method.selector);
        const handler = this.props.onRemoved;
        if (handler) {handler(method)}
    }

    menuOptions() {
        const local = 
            [
                {label: 'Rename', action: this.renameMethod},
                {label: 'Remove', action: this.removeMethod},
                null,
                {label: 'Senders', action: m => this.context.browseSenders(m.selector)},
                {label: 'Local senders', action: m => this.context.browseLocalSenders(m.selector, m.class)},
                {label: 'Implementors', action: m => this.context.browseImplementors(m.selector)},
                {label: 'Local implementors', action: m => this.context.browseLocalImplementors(m.selector, m.class)},
                {label: 'Class references', action: m => this.context.browseReferences(m.class)}
            ];
        const external = this.props.menuOptions; 
        return !external? local : external.concat(local);
    }

    render() {
        const size = 12;
        const methods = !this.props.methods? [] : this.props.methods;
        return (
            <CustomList
                itemLabel={this.props.showClass === true ? (m => m.class + '>>#' + m.selector) : "selector"}
                items={methods}
                selectedItem={this.props.selectedMethod}
                onSelect={this.props.onSelect}
                icons={methods.map(m => {
                    if (m.overriding && m.overriden) {
                        return <ArrowUpDownBold style={{fontSize: size}} />
                    }
                    if (m.overrriding) {
                        return <ArrowUpBold style={{fontSize: size}} />
                    }
                    if (m.overriden) {
                        return <ArrowDownBold style={{fontSize: size}} />    
                    }
                    return null
                })}
                menuOptions={this.menuOptions()}
            />
        )
    }
};

export default MethodList;