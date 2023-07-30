import React from 'react';
import Container from 'react-bootstrap/Container';

import { ContentService } from '../../services/ContentService';
import Login from '../Login';

export default class Header extends React.Component<
    {
        contentService: ContentService;
        onLoggedIn: () => void;
        onLoggedOut: () => void;
    }
> {

    render() {
        return (
            <header id="header" className="header fixed-top" data-scrollto-offset="0">
                <Container>                        <div className="container-fluid d-flex align-items-center justify-content-between">
                    <a href="/" className="logo d-flex align-items-center scrollto me-auto me-lg-0">
                        <h1>Z-Angel<span>.</span></h1>
                    </a>
                    <Login
                        contentService={this.props.contentService}
                        onLoggedIn={this.props.onLoggedIn}
                        onLoggedOut={this.props.onLoggedOut}
                    />
                </div>
                </Container>
            </header>
        );
    }
}
