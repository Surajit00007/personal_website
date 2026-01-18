// ... imports
import { LogOut, Save, Image, Plus, Trash, ExternalLink, Calendar, Tag, Briefcase, Award, GraduationCap, RotateCcw } from 'lucide-react';
// ... inside component
const handleDiscard = () => {
  if (confirm('Are you sure you want to discard unsaved changes?')) {
    setLocalContent(siteContent);
    toast.info('Changes discarded. Reverted to last saved version.');
  }
};

// ... inside render header
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate('/')}>
              <ExternalLink className="w-4 h-4 mr-2" />
              View Site
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            <Button variant="ghost" onClick={handleDiscard} className="text-muted-foreground hover:text-foreground">
                <RotateCcw className="w-4 h-4 mr-2" />
                Discard
            </Button>
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>


        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="bg-muted/50 p-1 w-full md:w-auto overflow-x-auto">
            <TabsTrigger value="about" className="data-[state=active]:bg-background">About Me</TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-background">Projects</TabsTrigger>
            <TabsTrigger value="certificates" className="data-[state=active]:bg-background">Certificates</TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-background">Contact</TabsTrigger>
          </TabsList>

          {/* ABOUT TAB */}
          <TabsContent value="about" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Section Title</Label>
                    <Input
                      value={localContent.about.title}
                      onChange={(e) => setLocalContent(prev => ({ ...prev, about: { ...prev.about, title: e.target.value } }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bio Description (Markdown supported)</Label>
                    <Textarea
                      className="min-h-[200px] font-mono text-sm"
                      value={localContent.about.description}
                      onChange={(e) => setLocalContent(prev => ({ ...prev, about: { ...prev.about, description: e.target.value } }))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Profile Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 flex flex-col items-center">
                  <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-muted relative group">
                    <img
                      src={localContent.about.profileImage || '/placeholder.svg'}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <Image className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                  <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                    Change Image
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* PROJECTS TAB */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1 mr-4">
                <Input
                  placeholder="Search projects..."
                  className="max-w-sm"
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                />
              </div>
              <Button onClick={addProject}>
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </div>

            <div className="grid gap-6">
              {localContent.projects
                .filter(p => p.title.toLowerCase().includes(projectSearch.toLowerCase()))
                .map((project) => (
                  <Card key={project.id} className="relative group overflow-hidden border-l-4 border-l-primary">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <Button variant="destructive" size="icon" onClick={() => removeProject(project.id)}>
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>

                    <CardContent className="p-6 grid md:grid-cols-12 gap-6">
                      <div className="md:col-span-8 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Title</Label>
                            <Input
                              value={project.title}
                              onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                              className="font-bold text-lg"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Subtitle</Label>
                            <Input
                              value={project.subtitle}
                              onChange={(e) => updateProject(project.id, 'subtitle', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Description</Label>
                          <Textarea
                            value={project.description}
                            onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                            rows={3}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">GitHub URL</Label>
                            <div className="relative">
                              <ExternalLink className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
                              <Input
                                value={project.github || ''}
                                onChange={(e) => updateProject(project.id, 'github', e.target.value)}
                                className="pl-8"
                                placeholder="https://github.com/..."
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Tags (comma separated)</Label>
                            <div className="relative">
                              <Tag className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
                              <Input
                                value={project.tags.join(',')}
                                onChange={(e) => updateProjectTags(project.id, e.target.value)}
                                className="pl-8"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-4 space-y-4 border-l pl-0 md:pl-6">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Category</Label>
                          <Select
                            value={project.category}
                            onValueChange={(val) => updateProject(project.id, 'category', val)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ACADEMIC">Academic Project</SelectItem>
                              <SelectItem value="PERSONAL">Personal Project</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Date</Label>
                          <div className="relative">
                            <Calendar className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
                            <Input
                              value={project.date}
                              onChange={(e) => updateProject(project.id, 'date', e.target.value)}
                              className="pl-8"
                            />
                          </div>
                        </div>

                        <div className="pt-2">
                          <div className="text-xs text-muted-foreground mb-2">Preview Card Badges</div>
                          <div className="flex flex-wrap gap-1">
                            <div className={`text-[10px] px-2 py-1 rounded bg-muted uppercase tracking-wider font-semibold border ${project.category === 'ACADEMIC' ? 'text-blue-400 border-blue-400/20' : 'text-purple-400 border-purple-400/20'}`}>
                              {project.category}
                            </div>
                            <div className="text-[10px] px-2 py-1 rounded bg-muted text-muted-foreground border">
                              {project.date}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* CERTIFICATES TAB */}
          <TabsContent value="certificates" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Certificates & Awards</h2>
                <p className="text-muted-foreground">Manage your certifications</p>
              </div>
              <Button onClick={addCertificate}>
                <Plus className="w-4 h-4 mr-2" />
                Add Certificate
              </Button>
            </div>

            <div className="grid gap-6">
              {localContent.certificates.map((cert) => (
                <Card key={cert.id} className="relative group overflow-hidden">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Button variant="destructive" size="icon" onClick={() => removeCertificate(cert.id)}>
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Image Section */}
                      <div className="w-full md:w-48 shrink-0 space-y-3">
                        <div className="aspect-square rounded-xl bg-muted border-2 border-dashed flex items-center justify-center overflow-hidden relative group/image">
                          {cert.imageUrl ? (
                            <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-cover" />
                          ) : (
                            <Award className="w-12 h-12 text-muted-foreground/50" />
                          )}
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity cursor-pointer" onClick={() => triggerCertImageUpload(cert.id)}>
                            <Image className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full" onClick={() => triggerCertImageUpload(cert.id)}>
                          Upload Image
                        </Button>
                      </div>

                      {/* Details Section */}
                      <div className="flex-1 space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Certificate Title</Label>
                            <Input
                              value={cert.title}
                              onChange={(e) => updateCertificate(cert.id, 'title', e.target.value)}
                              className="font-bold"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Issuing Organization</Label>
                            <Input
                              value={cert.issuer}
                              onChange={(e) => updateCertificate(cert.id, 'issuer', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Date Issued</Label>
                          <Input
                            value={cert.date}
                            onChange={(e) => updateCertificate(cert.id, 'date', e.target.value)}
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Description (One point per line)</Label>
                          <Textarea
                            value={cert.description.join('\n')}
                            onChange={(e) => updateCertificateDescription(cert.id, e.target.value)}
                            rows={4}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Hidden Input for Cert Image */}
            <input
              ref={certFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCertImageSelect}
            />
          </TabsContent>


          {/* CONTACT TAB */}
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Section Title</Label>
                    <Input
                      value={localContent.contact.title}
                      onChange={(e) => setLocalContent(prev => ({ ...prev, contact: { ...prev.contact, title: e.target.value } }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input
                      value={localContent.contact.email}
                      onChange={(e) => setLocalContent(prev => ({ ...prev, contact: { ...prev.contact, email: e.target.value } }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description Text</Label>
                  <Textarea
                    value={localContent.contact.description}
                    onChange={(e) => setLocalContent(prev => ({ ...prev, contact: { ...prev.contact, description: e.target.value } }))}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Social Links</Label>
                  {localContent.contact.socials.map((social, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-32">
                        <Input
                          value={social.platform}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                      <Input
                        value={social.url}
                        onChange={(e) => {
                          const newSocials = [...localContent.contact.socials];
                          newSocials[index].url = e.target.value;
                          setLocalContent(prev => ({ ...prev, contact: { ...prev.contact, socials: newSocials } }));
                        }}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div >

  {/* Image Crop Modal */ }
  < Dialog open = { showCropModal } onOpenChange = { setShowCropModal } >
    <DialogContent className="max-w-xl">
      <DialogHeader>
        <DialogTitle>Crop Image</DialogTitle>
      </DialogHeader>
      <div className="relative h-96 w-full bg-black/5 rounded-md overflow-hidden">
        {imageFile && (
          <Cropper
            image={imageFile}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            cropShape="round"
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
          />
        )}
      </div>
      <div className="space-y-4 py-4">
        <div className="flex gap-4 items-center">
          <Label className="w-16">Zoom</Label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1"
          />
        </div>
        <div className="flex gap-4 items-center">
          <Label className="w-16">Rotation</Label>
          <input
            type="range"
            min={0}
            max={360}
            value={rotation}
            onChange={(e) => setRotation(Number(e.target.value))}
            className="flex-1"
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => setShowCropModal(false)}>Cancel</Button>
        <Button onClick={createCroppedImage}>Apply Crop</Button>
      </DialogFooter>
    </DialogContent>
      </Dialog >
    </div >
  );
};

export default AdminDashboard;
