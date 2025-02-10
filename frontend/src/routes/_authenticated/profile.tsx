import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { toast } from '@/hooks/use-toast'
import { api, userQueryOptions } from '@/lib/api'
import { registerSchema } from '@/sharedTypes'
import { useForm } from '@tanstack/react-form'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { useEffect, useState } from 'react'

const Profile = () => {
  const [userData, setUserData] = useState<
    | {
        levels: {
          year: number
          level: number
          updatedAt: string
        }[]
        id: string
        name: string
        email: string
        imageUrl: string | null
        notificationHour: string | null
        profileVisibility: 'public' | 'private'
        desiredWeekFrequency: number
        loginProvider: 'email' | 'google'
        createdAt: string
        updatedAt: string
      }
    | undefined
  >(undefined)
  const [editEnabled, setEditEnabled] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues: {
      name: userData?.name ?? '',
      desiredWeekFrequency: userData?.desiredWeekFrequency ?? 0,
      notificationHour: userData?.notificationHour ?? '',
      profileVisibility: userData?.profileVisibility,
    },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)
      const response = await api.auth.me.$patch({
        json: {
          desiredWeekFrequency: value.desiredWeekFrequency,
          notificationHour: value.notificationHour,
          profileVisibility: value.profileVisibility,
          name: value.name,
        },
      })

      if (response.status === 204) {
        setEditEnabled(false)
        toast({
          title: 'Perfil atualizado',
          description: 'Perfil atualizado com sucesso',
          variant: 'default',
        })
        queryClient.invalidateQueries({ queryKey: ['get-current-user'] })
      } else {
        toast({
          title: 'Erro ao atualizar perfil',
          description: 'Erro ao atualizar perfil. Tente novamente',
          variant: 'destructive',
        })
      }

      setIsSubmitting(false)
    },
  })

  const { data } = useQuery(userQueryOptions)

  useEffect(() => {
    setUserData(data?.user)
  }, [data])

  return (
    <div className="h-full flex flex-col items-start justify-start text-white text-center p-4">
      <h1 className="text-4xl font-bold">Meu Perfil</h1>
      <form
        className="w-full flex flex-col items-start justify-start"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div className="mt-4 w-full flex gap-4 sm:flex-row flex-col">
          <form.Field
            name="name"
            validators={{
              onChange: registerSchema.shape.name,
            }}
            children={(field) => (
              <div className="flex flex-col w-full items-start">
                <label htmlFor="name">Nome:</label>
                <Input
                  id="name"
                  type="text"
                  value={field.state.value}
                  disabled={!editEnabled}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full"
                />
                {field.state.meta.errors ? (
                  <em className="text-red-600">{field.state.meta.errors}</em>
                ) : null}
              </div>
            )}
          />
          <div className="flex flex-col w-full items-start">
            <label htmlFor="email">Email:</label>
            <Input
              id="email"
              type="text"
              value={userData?.email ?? ''}
              disabled
              className="w-full"
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            <Link
              to="/forgot-password"
              search={{ email: userData?.email ?? '' }}
            >
              <Button className="mt-4" type="button">
                Alterar Senha
              </Button>
            </Link>
          </div>
        </div>
        <div className="mt-4 w-full flex sm:flex-row flex-col gap-4">
          <form.Field
            name="desiredWeekFrequency"
            validators={{
              onChange: registerSchema.shape.desiredWeekFrequency,
            }}
            children={(field) => (
              <div className="flex flex-col sm:w-[25%] items-start">
                <label htmlFor="profileVisibility">Frequência Semanal:</label>
                <Input
                  id="profileVisibility"
                  type="number"
                  max={7}
                  min={1}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  onBlur={field.handleBlur}
                  disabled={!editEnabled}
                  className="w-full"
                />
              </div>
            )}
          />
          <form.Field
            name="notificationHour"
            children={(field) => (
              <div className="flex flex-col sm:w-[25%] items-start">
                <label htmlFor="notificationHour">Hora Notificação:</label>
                <Input
                  id="notificationHour"
                  type="time"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(`${e.target.value}:00`)}
                  onBlur={field.handleBlur}
                  disabled={!editEnabled}
                  className="w-full"
                />
              </div>
            )}
          />
          <form.Field
            name="profileVisibility"
            children={(field) => (
              <div className="flex flex-col sm:w-[50%] items-start">
                <label htmlFor="profileVisibility">Visibilidade Perfil:</label>
                <Select
                  disabled={!editEnabled}
                  value={field.state.value}
                  onValueChange={(value: string) =>
                    field.handleChange(value as 'public' | 'private')
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Visibilidade Perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Visibilidade Perfil</SelectLabel>
                      <SelectItem value="public">Público</SelectItem>
                      <SelectItem value="private">Privado</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          />
        </div>
        <div className="flex flex-row items-center justify-center">
          {editEnabled && (
            <Button
              className="mt-4 mr-4"
              type="submit"
              variant="success"
              disabled={isSubmitting}
            >
              {isSubmitting && <Spinner size="small" className="mr-2" />}
              Salvar
            </Button>
          )}
          <Button
            className="mt-4 mr-4"
            variant="secondary"
            type="button"
            onClick={(ev) => {
              ev.preventDefault()
              setEditEnabled(!editEnabled)
            }}
            disabled={isSubmitting}
          >
            {editEnabled ? 'Cancelar' : 'Editar'}
          </Button>
        </div>
      </form>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <h1 className="text-2xl font-bold mt-8 cursor-pointer">
              Meus níveis
            </h1>
          </TooltipTrigger>
          <TooltipContent className="text-center">
            <p>Os níveis são calculados por ano</p>
            <p>O ano destacado abaixo é o ano atual</p>
            <p>Clique aqui para entender o cálculo do nível</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex flex-col items-start justify-start w-full pt-1 pb-8">
        {userData?.levels
          .sort((a, b) => b.year - a.year) // Sort by year descending
          .map((level) => (
            <div
              key={`${level.year}-${level.level}`}
              className="flex flex-row items-center justify-between w-full mt-2 bg-zinc-900 p-3 rounded-sm"
            >
              <div>
                <span className="text-lg font-semibold">
                  {level.year} - Nível {level.level}
                </span>
              </div>
              <div>
                <span className="text-sm">
                  Atualizado em:{' '}
                  {new Date(level.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/profile')({
  component: Profile,
})
