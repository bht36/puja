from django.db import migrations, models
import django.contrib.auth.validators


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0004_user_temp_email'),
    ]

    operations = [
        # date_of_birth doesn't exist in the actual DB (migration 0003 was never applied),
        # so we only update Django's state without touching the database.
        migrations.SeparateDatabaseAndState(
            database_operations=[],
            state_operations=[
                migrations.RemoveField(
                    model_name='user',
                    name='date_of_birth',
                ),
            ]
        ),
        migrations.AlterField(
            model_name='user',
            name='username',
            field=models.CharField(
                blank=True,
                default='',
                max_length=150,
                validators=[django.contrib.auth.validators.UnicodeUsernameValidator()],
                verbose_name='username',
            ),
        ),
    ]
