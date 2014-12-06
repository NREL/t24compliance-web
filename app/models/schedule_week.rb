class ScheduleWeek
  include Mongoid::Document
  include Mongoid::Timestamps
  field :name, type: String
  field :type, type: String
  field :schedule_day_all_days_reference, type: String
  field :schedule_day_weekdays_reference, type: String
  field :schedule_day_weekends_reference, type: String
  field :schedule_day_sunday_reference, type: String
  field :schedule_day_monday_reference, type: String
  field :schedule_day_tuesday_reference, type: String
  field :schedule_day_wednesday_reference, type: String
  field :schedule_day_thursday_reference, type: String
  field :schedule_day_friday_reference, type: String
  field :schedule_day_saturday_reference, type: String
  field :schedule_day_holiday_reference, type: String
  field :schedule_day_cooling_design_day_reference, type: String
  field :schedule_day_heating_design_day_reference, type: String

  belongs_to :project


  def self.children_models
    children = [

    ]
  end

  def self.xml_fields
    xml_fields = [
      {"db_field_name"=>"name", "xml_field_name"=>"Name"},
      {"db_field_name"=>"type", "xml_field_name"=>"Type"},
      {"db_field_name"=>"schedule_day_all_days_reference", "xml_field_name"=>"SchDayAllRef"},
      {"db_field_name"=>"schedule_day_weekdays_reference", "xml_field_name"=>"SchDayWDRef"},
      {"db_field_name"=>"schedule_day_weekends_reference", "xml_field_name"=>"SchDayWERef"},
      {"db_field_name"=>"schedule_day_sunday_reference", "xml_field_name"=>"SchDaySunRef"},
      {"db_field_name"=>"schedule_day_monday_reference", "xml_field_name"=>"SchDayMonRef"},
      {"db_field_name"=>"schedule_day_tuesday_reference", "xml_field_name"=>"SchDayTueRef"},
      {"db_field_name"=>"schedule_day_wednesday_reference", "xml_field_name"=>"SchDayWedRef"},
      {"db_field_name"=>"schedule_day_thursday_reference", "xml_field_name"=>"SchDayThuRef"},
      {"db_field_name"=>"schedule_day_friday_reference", "xml_field_name"=>"SchDayFriRef"},
      {"db_field_name"=>"schedule_day_saturday_reference", "xml_field_name"=>"SchDaySatRef"},
      {"db_field_name"=>"schedule_day_holiday_reference", "xml_field_name"=>"SchDayHolRef"},
      {"db_field_name"=>"schedule_day_cooling_design_day_reference", "xml_field_name"=>"SchDayClgDDRef"},
      {"db_field_name"=>"schedule_day_heating_design_day_reference", "xml_field_name"=>"SchDayHtgDDRef"}
    ]
  end

  def to_sdd_xml(xml)
    xml.send(:SchWeek) do
      xml_fields.each do |field|
        xml.send(:"#{field['xml_field_name']}", self[field['db_field_name']])
      end
      # go through children if they have something to add, call their methods
      kids = self.children_models
      unless kids.nil? || kids.empty?
        kids.each do |k|
          models = self.send(k.pluralize)
          models.each do |m|
            m.to_sdd_xml(xml)
          end
        end
      end
    end
  end

  def type_enums
    [
      'Fraction',
      'OnOff',
      'Temperature'
    ]
  end
end