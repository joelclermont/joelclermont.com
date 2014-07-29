Vagrant.configure("2") do |config|

  config.vm.provider "parallels" do |v|
    v.name = "joelblog"
  end

  config.vm.box = "parallels/ubuntu-14.04"

  config.vm.network :private_network, ip: "192.168.33.102"
  config.vm.network "forwarded_port", guest: 4000, host: 4000

  config.vm.provision "ansible" do |ansible|
    ansible.playbook = "ansible/playbook.yml"
  end

end
