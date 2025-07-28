import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Plus, FileText, Calendar, Clock } from "lucide-react";
import { animalAPI, Animal, Service, CreateServiceData, handleAPIError } from "@/lib/api";

const Services = () => {
  const { toast } = useToast();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string>("");

  // Form state
  const [formData, setFormData] = useState<CreateServiceData>({
    tipo: '',
    descricao: ''
  });

  // Load animals on component mount
  useEffect(() => {
    loadAnimals();
  }, []);

  // Load services when animal is selected
  useEffect(() => {
    if (selectedAnimalId) {
      loadServices(parseInt(selectedAnimalId));
    } else {
      setServices([]);
    }
  }, [selectedAnimalId]);

  const loadAnimals = async () => {
    try {
      setLoading(true);
      const data = await animalAPI.getAll();
      setAnimals(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar animais",
        description: handleAPIError(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const loadServices = async (animalId: number) => {
    try {
      setLoadingServices(true);
      const data = await animalAPI.getServices(animalId);
      setServices(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar serviços",
        description: handleAPIError(error),
      });
      setServices([]);
    } finally {
      setLoadingServices(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAnimalId || !formData.tipo || !formData.descricao) {
      toast({
        variant: "destructive",
        title: "Dados inválidos",
        description: "Por favor, selecione um animal e preencha todos os campos.",
      });
      return;
    }

    try {
      setSubmitting(true);
      const animalId = parseInt(selectedAnimalId);
      await animalAPI.createService(animalId, formData);
      
      const selectedAnimal = animals.find(a => a.id === animalId);
      toast({
        title: "Serviço registrado!",
        description: `Serviço para ${selectedAnimal?.nome} foi registrado com sucesso.`,
      });
      
      // Reset form and reload services
      setFormData({ tipo: '', descricao: '' });
      await loadServices(animalId);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao registrar serviço",
        description: handleAPIError(error),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Registro de Serviços
          </h1>
          <p className="text-lg text-muted-foreground">
            Registre e acompanhe todos os atendimentos e procedimentos realizados
          </p>
        </div>

        {/* Service Registration Form */}
        <Card className="mb-8 bg-gradient-to-br from-card to-card/90 border-0 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Registrar Novo Serviço
            </CardTitle>
            <CardDescription>
              Selecione um animal e registre o serviço realizado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="animal">Animal</Label>
                  {loading ? (
                    <div className="flex items-center space-x-2 p-3 border border-border rounded-md bg-muted">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Carregando animais...</span>
                    </div>
                  ) : (
                    <Select value={selectedAnimalId} onValueChange={setSelectedAnimalId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um animal" />
                      </SelectTrigger>
                      <SelectContent>
                        {animals.map((animal) => (
                          <SelectItem key={animal.id} value={animal.id.toString()}>
                            {animal.nome} - {animal.especie} ({animal.idade} anos)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Serviço</Label>
                  <Input
                    id="tipo"
                    type="text"
                    placeholder="Ex: Consulta, Vacina, Cirurgia..."
                    value={formData.tipo}
                    onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição do Serviço</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva detalhadamente o procedimento realizado, medicamentos aplicados, observações importantes..."
                  rows={4}
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  required
                />
              </div>
              
              <Button type="submit" disabled={submitting || !selectedAnimalId} className="w-full md:w-auto">
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Registrar Serviço
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Services History */}
        <Card className="bg-gradient-to-br from-card to-card/90 border-0 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Histórico de Serviços
            </CardTitle>
            <CardDescription>
              {selectedAnimalId 
                ? `Histórico completo de serviços para ${animals.find(a => a.id.toString() === selectedAnimalId)?.nome || 'animal selecionado'}`
                : "Selecione um animal para ver o histórico de serviços"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedAnimalId ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Selecione um animal</h3>
                <p className="text-muted-foreground">
                  Escolha um animal no formulário acima para visualizar seu histórico de serviços.
                </p>
              </div>
            ) : loadingServices ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Carregando histórico...</span>
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum serviço registrado</h3>
                <p className="text-muted-foreground">
                  Este animal ainda não possui serviços registrados. Registre o primeiro atendimento acima.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Descrição</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services
                      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                      .map((service) => (
                        <TableRow key={service.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-primary" />
                              {formatDate(service.data)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                              {service.tipo}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-md">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {service.descricao}
                            </p>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Services;