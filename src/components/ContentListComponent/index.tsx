import React from 'react';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faVideo } from '@fortawesome/free-solid-svg-icons';

// The .js references are necessary for requireJs to work in the browser.
import { IContentService, IContentListEntry } from '../../services/ContentService';
import ContentListEntryComponent from '../ContentListEntryComponent';

export default class ContentList extends React.Component<{
    contentService: IContentService;
}> {
    constructor(props: { contentService: IContentService }) {
        super(props);

        this.state = { contentList: [], user: { role: '' } };
        this.contentService = props.contentService;
        this.testRef = React.createRef();
    }
    public state: {
        contentList: IContentListEntry[];
        user: { role: string };
    };
    protected testRef: any;
    protected contentService: IContentService;
    /**
     * Keeps track of newly created content to assign a key
     * @memberof ContentList
     */
    protected newCounter = 0;

    public componentDidMount(): void {
        this.setState({ user: JSON.parse(localStorage.getItem('user') || '{}') })
    }

    public render(): React.ReactNode {
        return (
            <div>
                {!(this.state.user.role === 'student') ?
                    <Button
                        variant="primary"
                        onClick={() => this.new()}
                        className="my-2"
                    >
                        <FontAwesomeIcon icon={faPlusCircle} className="me-2" />
                        Create new content
                    </Button>
                    : null}
                <Button
                    variant="primary"
                    onClick={() => this.display()}
                    className="m-2 scrollto"
                >
                    <FontAwesomeIcon icon={faVideo} className="me-2" />
                    View content
                </Button>
                <ListGroup ref={this.testRef}>
                    {this.state.contentList.map((content) => (
                        <ContentListEntryComponent
                            contentService={this.contentService}
                            data={content}
                            key={content.originalNewKey ?? content.contentId}
                            onDiscard={() => this.onDiscard(content)}
                            onDelete={() => this.onDelete(content)}
                            onSaved={(newData) =>
                                this.onSaved(content, newData)
                            }
                            generateDownloadLink={
                                this.contentService.generateDownloadLink
                            }
                        ></ContentListEntryComponent>
                    ))}
                </ListGroup>

            </div>
        );
    }

    protected async updateList(): Promise<void> {
        const contentList = await this.contentService.list();
        this.setState({ contentList });
    }

    protected display() {
        this.updateList()
        setTimeout(() => {
            this.testRef.current.scrollIntoView()
        }, 500);
    }
    protected new() {
        this.setState({
            contentList: [
                {
                    contentId: 'new',
                    mainLibrary: undefined,
                    title: 'New H5P',
                    originalNewKey: `new-${this.newCounter++}`
                },
                ...this.state.contentList
            ]
        });
        setTimeout(() => {
            this.testRef.current.scrollIntoView()
        }, 500);
    }

    protected onDiscard(content) {
        this.setState({
            contentList: this.state.contentList.filter((c) => c !== content)
        });
    }

    protected async onDelete(content: IContentListEntry) {
        if (!content.contentId) {
            return;
        }
        try {
            await this.contentService.delete(content.contentId);
            this.setState({
                contentList: this.state.contentList.filter((c) => c !== content)
            });
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            }
        }
    }

    protected async onSaved(
        oldData: IContentListEntry,
        newData: IContentListEntry
    ) {
        this.setState({
            contentList: this.state.contentList.map((c) =>
                c === oldData ? newData : c
            )
        });
    }
}
