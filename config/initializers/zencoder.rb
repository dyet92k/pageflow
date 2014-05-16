require 'zencoder'
require 'pageflow/zencoder_api'

Pageflow.after_configure do
  zencoder_options = Pageflow.config.zencoder_options
  zencoder_options.reverse_merge!(:attachments_version => 'v1')

  Zencoder.api_key = zencoder_options.fetch(:api_key) { raise "Missing api_key option in Pageflow.config.zencoder_options." }

  Pageflow::ZencoderOutputDefinition.default_output_bucket_name = zencoder_options.fetch(:output_bucket) { raise "Missing output_bucket option in Pageflow.config.zencoder_options." }
  Pageflow::ZencoderOutputDefinition.default_sftp_host = zencoder_options[:sftp_host]

  raise "Missing s3_host_alias option in Pageflow.config.zencoder_options." unless zencoder_options.has_key?(:s3_host_alias)
  raise "Missing s3_protocol option in Pageflow.config.zencoder_options." unless zencoder_options.has_key?(:s3_protocol)
end

Paperclip.interpolates(:zencoder_host_alias) do |attachment, style|
  Pageflow.config.zencoder_options.fetch(:s3_host_alias)
end

Paperclip.interpolates(:zencoder_hls_host_alias) do |attachment, style|
  Pageflow.config.zencoder_options.fetch(:hls_host_alias, Pageflow.config.zencoder_options.fetch(:s3_host_alias))
end

Paperclip.interpolates(:zencoder_hls_origin_host_alias) do |attachment, style|
  Pageflow.config.zencoder_options.fetch(:hls_origin_host_alias, Pageflow.config.zencoder_options.fetch(:s3_host_alias))
end

Paperclip.interpolates(:zencoder_protocol) do |attachment, style|
  Pageflow.config.zencoder_options.fetch(:s3_protocol)
end

Paperclip.interpolates(:zencoder_asset_version) do |attachment, style|
  Pageflow.config.zencoder_options.fetch(:attachments_version)
end