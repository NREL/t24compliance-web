namespace :sim do
  desc 'import test project'
  task import_test_project: :environment do
    # import some cbecc com models
    users_accounts = %w(larry.brackney@nrel.gov nllong@me.com test@nrel.gov amir.roth@ee.doe.gov)
    users = User.where(:email.in => users_accounts)

    users.each do |u|
      # remove the old projects
      if u.projects
        projects = u.projects.exists(import_filename: true)
        puts "Removing #{projects.count} projects from #{u.email}"

        projects.each { |p| p.destroy }
      end

      files = []
      #files += [File.join(Rails.root, "spec/files/cbecc_com_instances/0200016-OffSml-SG-BaseRun.xml")]
      files += Dir['spec/files/cbecc_com_instances_3b/*.xml']
      files += Dir['spec/files/cbecc_com_web_instances/*.xml']
      files.each do |f|
        if f =~ /_out.xml/
          puts "skipping #{f} because it looks like an out file"
          next
        end

        if f =~ /RetlMed/
          puts "skipping retail because constructiond do not work"
          next
        end

        puts "Importing #{f} for #{u.email}"
        p = Project.from_sdd_xml(f)
        p.user_id = u.id
        p.building.user_id = u.id
        p.building.save!
        p.save!
        puts "Imported #{p.name} for #{u.email}"

        # round trip testing
        p.xml_save("#{File.dirname(f)}/#{File.basename(f, '.*')}_out.xml")
      end
    end
  end

  desc 'remove orphaned objects'
  task remove_orphaned_objects: :environment do
    %w( schedule_days schedule_weeks schedules construct_assemblies materials fenestration_constructions
door_constructions space_function_defaults luminaires curve_linears curve_quadratics curve_cubics curve_double_quadratics
building external_shading_objects fluid_systems simulation construction_default).each do |k|
      klass = k.singularize.camelize.constantize
      klass.all.each do |o|
        if o.project
          puts "Found valid object for #{k}"
        else
          puts "could not find project for #{o.name} #{o.id}, will try to destroy"
          o.destroy
        end
      end
    end
  end
end
