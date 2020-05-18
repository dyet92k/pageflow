import {Object} from 'pageflow/ui';
import {watchCollections} from '../../entryState';
import {InsertContentElementDialogView} from '../views/InsertContentElementDialogView'

export const PreviewMessageController = Object.extend({
  initialize({entry, iframeWindow, editor}) {
    this.entry = entry;
    this.iframeWindow = iframeWindow;
    this.editor = editor;

    this.listener = this.handleMessage.bind(this);
    window.addEventListener('message', this.listener);
  },

  dispose() {
    window.removeEventListener('message', this.listener);
  },

  handleMessage(message) {
    if (window.location.href.indexOf(message.origin) === 0) {
      if (message.data.type === 'READY') {
        const postMessage = message => {
          this.iframeWindow.postMessage(message, window.location.origin);
        };

        watchCollections(this.entry, {
          dispatch: action => {
            postMessage({type: 'ACTION', payload: action})
          }
        });

        this.listenTo(this.entry, 'scrollToSection', section =>
          postMessage({
            type: 'SCROLL_TO_SECTION',
            payload: {
              index: this.entry.sections.indexOf(section)
            }
          })
        );

        this.listenTo(this.entry, 'selectContentElement', contentElement =>
          postMessage({
            type: 'SELECT',
            payload: {
              id: contentElement.id,
              type: 'contentElement'
            }
          })
        );

        this.listenTo(this.entry, 'resetSelection', contentElement =>
          postMessage({
            type: 'SELECT',
            payload: null
          })
        );

        postMessage({type: 'ACK'})
      }
      else if (message.data.type === 'CHANGE_SECTION') {
        this.entry.set('currentSectionIndex', message.data.payload.index);
      }
      else if (message.data.type === 'SELECTED') {
        const {id} = message.data.payload;

        if (id) {
          this.editor.navigate(`/scrolled/content_elements/${id}`, {trigger: true})
        }
        else {
          this.editor.navigate('/', {trigger: true})
        }
      }
      else if (message.data.type === 'INSERT_CONTENT_ELEMENT') {
        const {id, position, at} = message.data.payload;

        InsertContentElementDialogView.show({
          entry: this.entry,
          insertOptions: {position, id, at},
          editor: this.editor
        });
      }
      else if (message.data.type === 'UPDATE_CONTENT_ELEMENT') {
        const {id, configuration} = message.data.payload;
        this.entry.contentElements.get(id).configuration.set(configuration, {ignoreInWatchCollection: true});
      }
    }
  }
});