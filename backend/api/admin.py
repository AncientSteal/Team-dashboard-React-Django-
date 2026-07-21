from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Task, Notification, Message, CustomUser


# Register your models here.
@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'position', 'is_staff', 'is_active')
    fieldsets = UserAdmin.fieldsets + (
        ('Extra info', {'fields': ('position', 'avatar_url')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Extra info', {'fields': ('position', 'avatar_url')}),
    )

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'assigned_to', 'deadline', 'status', 'created_at', 'updated_at')
    list_filter = ('status', 'assigned_to')
    search_fields = ('title', 'description')

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('chat_room', 'sender', 'text_preview', 'created_at')
    list_filter = ('chat_room', 'sender')
    search_fields = ('text',)

    def text_preview(self, obj):
        return obj.text[:20] + '...' if len(obj.text) > 20 else obj.text
    text_preview.short_description = 'Text message'

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'text', 'is_read', 'created_at')
    list_filter = ('is_read', 'user')