json.extract! @data, :id, :created_at, :updated_at, 'status', 'percent_complete', 'cbecc_code',
              'cbecc_code_description', 'error_messages', 'warning_messages', 'percent_complete_message',
              'job_id', 'queue', 'compliance_report_pdf_path', 'compliance_report_xml', 'analysis_results_xml',
              'openstudio_model_proposed', 'openstudio_model_baseline', 'results_zip_file'
