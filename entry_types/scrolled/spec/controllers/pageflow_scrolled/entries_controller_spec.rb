require 'spec_helper'

require 'pageflow/entries_controller_test_helper'
require 'pageflow/test_widget_type'

require 'pageflow/matchers/have_meta_tag'

module PageflowScrolled
  RSpec.describe EntriesController, type: :controller do
    include Pageflow::EntriesControllerTestHelper

    render_views

    describe '#show' do
      it 'renders script tag for frontend js' do
        entry = create(:entry, :published, type_name: 'scrolled')

        get_with_entry_env(:show, entry: entry)

        expect(response.body).to have_selector('script[src*=pageflow-scrolled-frontend]',
                                               visible: false)
      end

      it 'renders widget head fragments' do
        widget_type = Pageflow::TestWidgetType
                      .new(name: 'test_widget',
                           rendered_head_fragment: '<meta name="some_test" content="value">')

        pageflow_configure do |config|
          config.widget_types.register(widget_type)
        end

        entry = create(:entry, :published, type_name: 'scrolled')
        create(:widget, subject: entry.published_revision, type_name: 'test_widget')

        get_with_entry_env(:show, entry: entry)

        expect(response.body).to have_meta_tag.with_name('some_test')
      end

      it 'renders widgets at bottom of entry' do
        widget_type = Pageflow::TestWidgetType.new(name: 'test_widget',
                                                   rendered: '<div class="test_widget"></div>')

        pageflow_configure do |config|
          config.widget_types.register(widget_type)
        end

        entry = create(:entry, :published, type_name: 'scrolled')
        create(:widget, subject: entry.published_revision, type_name: 'test_widget')

        get_with_entry_env(:show, entry: entry)

        expect(response.body).to have_selector('div.test_widget')
      end

      it 'lets widget types opt out if being rendered in preview' do
        widget_type = Pageflow::TestWidgetType
                      .new(name: 'test_widget',
                           enabled_in_preview: false,
                           rendered_head_fragment: '<meta name="some_test" content="value">',
                           rendered: '<div class="test_widget"></div>')

        pageflow_configure do |config|
          config.widget_types.register(widget_type)
        end

        entry = create(:entry, :published, type_name: 'scrolled')
        create(:widget, subject: entry.draft, type_name: 'test_widget')

        get_with_entry_env(:show, entry: entry, mode: :preview)

        expect(response.body).not_to have_selector('div.test_widget')
        expect(response.body).not_to have_meta_tag.with_name('some_test')
      end
    end
  end
end
