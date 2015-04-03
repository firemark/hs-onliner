from setuptools import setup, find_packages
setup(
    name="hs-onliner",
    version="0.0.1",
    author="Firemark",
    author_email="marpiechula@gmail.com",
    description="Site to view who will be in hackerspace every week."
    license="MIT",
    keywords="example documentation tutorial",
    url="https://github.com/firemark/hs-onliner",
    packages=find_packages(),
    install_requires=(
        'Flask==0.10.1',
        'CodernityDB==0.4.2'
    )
)
