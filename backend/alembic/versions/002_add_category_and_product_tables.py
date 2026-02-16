"""add category and product tables

Revision ID: 002
Revises: 001
Create Date: 2025-02-16

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Category table (self-referential parent_id)
    op.create_table(
        "category",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("slug", sa.String(length=120), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("parent_id", sa.Integer(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["parent_id"], ["category.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_category_name"), "category", ["name"], unique=True)
    op.create_index(op.f("ix_category_slug"), "category", ["slug"], unique=True)
    op.create_index(op.f("ix_category_parent_id"), "category", ["parent_id"], unique=False)

    # Product table
    op.create_table(
        "product",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("slug", sa.String(length=250), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("price", sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column("discount_price", sa.Numeric(precision=10, scale=2), nullable=True),
        sa.Column("images", postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default=sa.text("'[]'::jsonb")),
        sa.Column("sizes", postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default=sa.text("'[]'::jsonb")),
        sa.Column("colors", postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default=sa.text("'[]'::jsonb")),
        sa.Column("stock", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("category_id", sa.Integer(), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["category_id"], ["category.id"], ondelete="RESTRICT"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_product_name"), "product", ["name"], unique=False)
    op.create_index(op.f("ix_product_slug"), "product", ["slug"], unique=True)
    op.create_index(op.f("ix_product_category_id"), "product", ["category_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_product_category_id"), table_name="product")
    op.drop_index(op.f("ix_product_slug"), table_name="product")
    op.drop_index(op.f("ix_product_name"), table_name="product")
    op.drop_table("product")
    op.drop_index(op.f("ix_category_parent_id"), table_name="category")
    op.drop_index(op.f("ix_category_slug"), table_name="category")
    op.drop_index(op.f("ix_category_name"), table_name="category")
    op.drop_table("category")
