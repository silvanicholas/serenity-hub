"""updated user constraint

Revision ID: 60dbf9fff07b
Revises: 338ffca8cdda
Create Date: 2024-11-20 17:53:37.368997

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '60dbf9fff07b'
down_revision = '338ffca8cdda'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('users')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('username', sa.VARCHAR(length=80), nullable=False),
    sa.Column('email', sa.VARCHAR(length=120), nullable=False),
    sa.Column('password_hash', sa.VARCHAR(length=128), nullable=True),
    sa.Column('google_id', sa.VARCHAR(length=128), nullable=True),
    sa.Column('profile_picture', sa.VARCHAR(length=256), nullable=True),
    sa.Column('auth_provider', sa.VARCHAR(length=20), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('google_id'),
    sa.UniqueConstraint('username')
    )
    # ### end Alembic commands ###