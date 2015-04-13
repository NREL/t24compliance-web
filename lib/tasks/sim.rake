namespace :sim do
  desc 'import test project'
  task import_test_project: :environment do
    # import some cbecc com models
    u = User.where(email: 'test@nrel.gov').first

    # remove the old projects
    if u.projects
      projects = u.projects.exists(import_filename: true)
      puts "Removing #{projects.count} projects"

      projects.each {|p| p.destroy}
    end

    files = []
    #files += [File.join(Rails.root, "spec/files/cbecc_com_instances/0200016-OffSml-SG-BaseRun.xml")]
    files += [File.join(Rails.root, "spec/files/cbecc_com_instances_3b/020012S-OffSml-CECStd.xml")]
    files += Dir['spec/files/cbecc_com_web_instances/*.xml']
    files.each do |f|
      if f =~ /_out.xml/
        puts "skipping #{f} because it looks like an out file"
        next
      end
      puts "Importing #{f}"
      p = Project.from_sdd_xml(f)
      p.user_id = u.id
      p.save!
      puts "Imported #{p.name}"

      # round trip testing
      p.xml_save("#{File.dirname(f)}/#{File.basename(f, '.*')}_out.xml")


    end
  end
end
