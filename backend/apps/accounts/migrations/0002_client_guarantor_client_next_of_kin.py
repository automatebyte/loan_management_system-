from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='client',
            name='guarantor',
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AddField(
            model_name='client',
            name='next_of_kin',
            field=models.JSONField(blank=True, default=list),
        ),
    ]
