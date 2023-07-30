import React from 'react';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';

import ContentListComponent from './components/ContentListComponent';
import { ContentService } from './services/ContentService';
import Header from './components/Header';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.contentService = new ContentService('/h5p');
    }

    private contentService: ContentService;

    public state: {
        loggedIn: boolean;
    } = {
            loggedIn: false,
        };

    render() {
        return (
            <div >
                <Container>
                    <Header
                        contentService={this.contentService}
                        onLoggedIn={() => {
                            this.setState({ loggedIn: true, user: localStorage.getItem('user') });
                        }}
                        onLoggedOut={() => {
                            this.setState({ loggedIn: false });
                        }}
                    />
                    <div id="hero-animated" className="hero-animated d-flex align-items-center">
                        <div className="container d-flex flex-column justify-content-center align-items-center text-center position-relative" >
                            <img src="assets/img/hero-carousel/hero-carousel-3.svg" className="img-fluid animated" alt='' />
                            <h2>Welcome to <span>Z-Angel LMS</span></h2>
                            <p>Learn, Grow, Succeed.</p>

                            <div className="d-flex">
                                {this.state.loggedIn ? (
                                    <ContentListComponent
                                        contentService={this.contentService}
                                    ></ContentListComponent>
                                ) : (
                                    <Alert variant="danger">
                                        Content is only visible to logged in users! Please
                                        log in with the button on the top
                                    </Alert>
                                )}
                            </div>

                        </div>
                    </div>
                </Container>
            </div>
        );
    }
}
