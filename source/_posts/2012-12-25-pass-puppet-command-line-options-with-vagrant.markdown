---
layout: post
title: "Pass Puppet command line options with Vagrant"
date: 2012-12-25 23:03
comments: true
categories: [programming]
---
This week, I finally blocked some time to seriously investigate Vagrant and Puppet. The documentation for both tools is decent.

Taking the knowledge I gained from reading through the "Quick Start" documents, my next logical step was to spin up my own custom development environment for local usage. I quickly ran into some issues and wanted to enable the "debug" mode of Puppet. Since I'm not calling Puppet directly, it's not as easy as tacking on a ```--debug``` option to the puppet command line. Instead, I need to tell Vagrant to run Puppet in debug mode, using the Vagrantfile.
<!-- more -->
The documentation for Vagrant addresses [how to pass command line options](http://vagrantup.com/v1/docs/provisioners/puppet.html), but they don't show a complete example involving both command line options and the block syntax you normally use to setup the Puppet configuration. Here are two ways that you can use to pass both:

``` ruby
config.vm.provision :puppet, :options => ['--verbose', '--someotheroption'] do |puppet|
  puppet.manifests_path = "manifests"
  puppet.manifest_file = "default.pp"
end
```

If you have a lot of options to pass, that can be a bit bulky in this format. Here is another way that works as well:

``` ruby
config.vm.provision :puppet do |puppet|
  puppet.manifests_path = "manifests"
  puppet.manifest_file = "default.pp"
  puppet.options << '--verbose'
  puppet.options << '--someotheroption'
  # puppet.options is a hash so you can keep adding options across multiple lines
end
```