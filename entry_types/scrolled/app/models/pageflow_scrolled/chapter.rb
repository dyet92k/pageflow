module PageflowScrolled
  class Chapter < Pageflow::ApplicationRecord
    include Pageflow::SerializedConfiguration
    include Pageflow::AutoGeneratedPermaId

    belongs_to :storyline, touch: true
    has_many :sections,
             -> { order('pageflow_scrolled_sections.position ASC') },
             dependent: :destroy,
             inverse_of: :chapter
    has_many :content_elements, through: :sections

    attr_accessor :revision # used on :create to lazily create storyline
    before_validation :ensure_storyline, on: :create

    def self.all_for_revision(revision)
      joins(storyline: :revision)
        .where(pageflow_scrolled_storylines: {revision_id: revision})
    end

    def copy_to(storyline)
      chapter = dup
      storyline.chapters << chapter

      sections.each do |section|
        section.copy_to(chapter)
      end
    end

    private

    def ensure_storyline
      return if storyline.present?
      unless Storyline.all_for_revision(revision).exists?
        Storyline.create!(revision: revision, configuration: {main: true})
      end
      self.storyline = Storyline.all_for_revision(revision).first
    end
  end
end
