import React, { PureComponent } from 'react';

export default class AsyncComponentLoader extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            Component: null
        };
        this.loadComponent = this.loadComponent.bind(this);
        this.unmounted = false;
    }

    loadComponent({ componentName, loadComponentModule }) {
        loadComponentModule()
            .then(({ default: Component }) => {
                !this.unmounted && this.setState(() => ({ Component }));
            }).catch(e => {});
    }

    componentWillMount() {
    	const { componentName, loadComponentModule } = this.props;
        this.loadComponent({ componentName, loadComponentModule });
    }

    componentWillReceiveProps({ componentName, loadComponentModule }) {
        this.loadComponent({ componentName, loadComponentModule });
    }

    componentWillUnmount() {
        this.unmounted = true;
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