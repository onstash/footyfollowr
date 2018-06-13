import React, { PureComponent } from 'react';

export default class AsyncComponentLoader extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            Component: null
        };
        this.loadComponent = this.loadComponent.bind(this);
    }

    loadComponent({ componentName, loadComponentModule }) {
        loadComponentModule()
            .then(({ default: Component }) => {
                this.setState(() => ({ Component }));
            }).catch(console.error);
    }

    componentWillMount() {
    	const { componentName, loadComponentModule } = this.props;
        this.loadComponent({ componentName, loadComponentModule });
    }

    componentWillReceiveProps({ componentName, loadComponentModule }) {
        this.loadComponent({ componentName, loadComponentModule });
    }

    render() {
        const { Component } = this.state;
        if (!Component) {
            return null;
        }
        const { componentProps } = this.props;
        return <Component {...componentProps} />;
    }
}