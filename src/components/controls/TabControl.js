import React, { PureComponent } from 'react';
import { Tabs, Tab, IconButton } from '@material-ui/core';
import TabPanel from './TabPanel';
import CloseIcon from '@material-ui/icons/Close';

class TabControl extends PureComponent {
  tabLabel = (page, index) => {
    return (
      <span>
        {React.cloneElement(page.icon, {className: this.props.styles.tabIcon})}
        {page.label}
        <IconButton 
          onClick={event => {this.closeTab(event, index)}}
          id={index}
          value={index}
          size="small">
            <CloseIcon fontSize="small" id={index} value={index}/>
        </IconButton>
      </span>
    )
  }

  tabChanged = (event, index) => {
    event.preventDefault();
    const handler = this.props.onSelect;
    if (handler) {handler(this.props.pages[index])}
  }

  closeTab = (event, index) => {
    event.stopPropagation();
    const page = this.props.pages[index];
    const handler = this.props.onClose;  
    if (handler) {handler(page)}
  }

  render() {
    const {pages, selectedPage} = this.props;
    const selectedIndex = pages.indexOf(selectedPage);
    const styles = this.props.styles;
    return (
        <div className={styles.tabControl}>
            <Tabs
              value={Math.max(selectedIndex, 0)}
              onChange={this.tabChanged}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto">
                {pages.map((p, i) => {
                  return (
                    <Tab
                      component="div"
                      key={i.toString()}
                      label={this.tabLabel(p, i)}
                      id= {`tab-${i}`}/>)
                })}
            </Tabs>
            {pages.map((p, i) => {
              return (
                <TabPanel
                  id={`tabpanel-${i}`}
                  key={i.toString()}
                  index={i}
                  styles={styles}
                  visible={p === selectedPage}>
                    {p.component}
                </TabPanel>)
            })}
        </div>
    )
  }
}

export default TabControl;